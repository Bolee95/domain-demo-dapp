pragma solidity 0.8.22;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";


// google.com - google je domain, top domain je com
// Claim -> kupovina domena
// Revoke -> odbacivanje domena
// Transfer -> transfer domena
// resolve -> (domain, topDomain) -> ID
// reverseResolve -> ID -> (domain, topDomain)
contract DomainNFT is ERC721 {
    using Strings for address;

    struct DomainType {
        string domain;
        string topDomain;
        uint256 price;
    }

    mapping(bytes32 domainHash => uint256 tokenId) private _domainHashToID;
    mapping(uint256 tokenId => DomainType) private _IDToDomain;

    uint256 private _tokenCounter;

    event DomainClaimed(address owner, uint256 tokenId, bytes32 uniqueDomainHash);

    error NotEnoughEtherSend();
    error InvalidTopDomain();
    error AlreadyOwned();

    constructor() ERC721("AcademyDomains", "AD") { }

    function claim(string calldata domain, string calldata topDomain) external payable {
        if (msg.value < 0.0001 ether) revert NotEnoughEtherSend();

        if (keccak256(bytes(topDomain)) != keccak256(bytes("academy"))) revert InvalidTopDomain();

        bytes32 hash = _getDomainHash(domain, topDomain);

        if (_domainHashToID[hash] != 0) revert AlreadyOwned();

        uint256 tokenId = ++_tokenCounter;
        _mint(msg.sender, tokenId);
        _domainHashToID[hash] = tokenId;
        _IDToDomain[tokenId] = DomainType({
            domain: domain,
            topDomain: topDomain,
            price: msg.value
        });

        emit DomainClaimed(msg.sender, _tokenCounter, hash);
    }

    function latestID() external view returns (uint256) {
        return _tokenCounter;
    }

    function getDomainById(uint256 id) external view  returns (DomainType memory) {
        return _IDToDomain[id];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Potrebno je da svi tipovi u `abi.encodePacked` budu isti, u ovom slucaju, strings
        return string(bytes(abi.encodePacked(
            '{"owner": "',
            // `toHexString` dostupan kroz `Strings` biblioteku
            ownerOf(tokenId).toHexString(),
            '"}'
        )));
    }

    function resolve(string calldata domain, string calldata topDomain) external view returns (uint256) {
        return _domainHashToID[_getDomainHash(domain, topDomain)];
    }

    function reverseResolve(uint256 tokenId) external view returns (string memory) {
        DomainType memory dt = _IDToDomain[tokenId];
        return string(abi.encodePacked(dt.domain, ".", dt.topDomain));
    }

    function _getDomainHash(string calldata domain, string calldata topDomain) private pure returns (bytes32) {
        // Izlaz od abi.enocdePacked je bytes (domain + topDomain)
        return keccak256(abi.encodePacked(domain, topDomain));
    }
}