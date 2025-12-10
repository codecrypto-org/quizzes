// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title QuizCertificate
 * @dev Soulbound Token (SBT) que certifica la completación de quizzes
 * Los tokens no pueden ser transferidos una vez mintados
 */
contract QuizCertificate is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter = 1; // Start from 1 to allow 0 as "not exists"

    struct Certificate {
        string quizName;
        uint256 score;
        uint256 totalQuestions;
        uint256 timestamp;
        string difficulty;
        string category;
    }

    mapping(uint256 => Certificate) public certificates;

    // Mapeo de dirección + hash del quiz => tokenId para evitar duplicados
    mapping(address => mapping(bytes32 => uint256)) public userQuizCertificates;

    event CertificateMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        string quizName,
        uint256 score,
        uint256 totalQuestions
    );

    constructor() ERC721("Quiz Certificate", "QCERT") Ownable(msg.sender) {}

    /**
     * @dev Mintea un nuevo certificado SBT
     * @param recipient Dirección del usuario que completó el quiz
     * @param quizName Nombre del quiz
     * @param score Puntaje obtenido
     * @param totalQuestions Número total de preguntas
     * @param difficulty Dificultad del quiz
     * @param category Categoría del quiz
     */
    function mintCertificate(
        address recipient,
        string memory quizName,
        uint256 score,
        uint256 totalQuestions,
        string memory difficulty,
        string memory category
    ) public onlyOwner returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(score <= totalQuestions, "Score cannot exceed total questions");
        require(bytes(quizName).length > 0, "Quiz name cannot be empty");

        // Verificar si ya existe un certificado para este usuario y quiz
        bytes32 quizHash = keccak256(abi.encodePacked(quizName));
        uint256 existingTokenId = userQuizCertificates[recipient][quizHash];

        if (existingTokenId != 0) {
            // Si existe, actualizar si el nuevo score es mayor
            Certificate storage existingCert = certificates[existingTokenId];
            if (score > existingCert.score) {
                existingCert.score = score;
                existingCert.timestamp = block.timestamp;
            }
            return existingTokenId;
        }

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(recipient, tokenId);

        certificates[tokenId] = Certificate({
            quizName: quizName,
            score: score,
            totalQuestions: totalQuestions,
            timestamp: block.timestamp,
            difficulty: difficulty,
            category: category
        });

        userQuizCertificates[recipient][quizHash] = tokenId;

        string memory tokenURI = _generateTokenURI(tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit CertificateMinted(recipient, tokenId, quizName, score, totalQuestions);

        return tokenId;
    }

    /**
     * @dev Genera el metadata JSON on-chain para el certificado
     */
    function _generateTokenURI(uint256 tokenId) private view returns (string memory) {
        Certificate memory cert = certificates[tokenId];

        uint256 percentage = (cert.score * 100) / cert.totalQuestions;

        string memory svg = _generateSVG(cert, percentage);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Quiz Certificate #',
                        tokenId.toString(),
                        '",',
                        '"description": "Certificate of completion for ',
                        cert.quizName,
                        '",',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '",',
                        '"attributes": [',
                        '{"trait_type": "Quiz", "value": "',
                        cert.quizName,
                        '"},',
                        '{"trait_type": "Score", "value": "',
                        cert.score.toString(),
                        '/',
                        cert.totalQuestions.toString(),
                        '"},',
                        '{"trait_type": "Percentage", "value": ',
                        percentage.toString(),
                        '},',
                        '{"trait_type": "Difficulty", "value": "',
                        cert.difficulty,
                        '"},',
                        '{"trait_type": "Category", "value": "',
                        cert.category,
                        '"},',
                        '{"trait_type": "Date", "display_type": "date", "value": ',
                        cert.timestamp.toString(),
                        "}]}"
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @dev Genera el SVG del certificado
     */
    function _generateSVG(Certificate memory cert, uint256 percentage) private pure returns (string memory) {
        string memory color = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#3b82f6" : "#f59e0b";

        return string(
            abi.encodePacked(
                '<svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">',
                '<rect width="500" height="400" fill="#1f2937"/>',
                '<rect x="10" y="10" width="480" height="380" fill="none" stroke="',
                color,
                '" stroke-width="3"/>',
                '<text x="250" y="60" font-family="Arial" font-size="28" fill="white" text-anchor="middle" font-weight="bold">Quiz Certificate</text>',
                '<text x="250" y="120" font-family="Arial" font-size="18" fill="',
                color,
                '" text-anchor="middle" font-weight="bold">',
                cert.quizName,
                '</text>',
                '<text x="250" y="180" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle">Score: ',
                cert.score.toString(),
                '/',
                cert.totalQuestions.toString(),
                ' (',
                percentage.toString(),
                '%)</text>',
                '<text x="250" y="220" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle">Difficulty: ',
                cert.difficulty,
                '</text>',
                '<text x="250" y="250" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle">Category: ',
                cert.category,
                '</text>',
                '<text x="250" y="330" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">Issued on blockchain</text>',
                '<text x="250" y="350" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">Soulbound Token - Non-Transferable</text>',
                "</svg>"
            )
        );
    }

    /**
     * @dev Obtiene todos los certificados de un usuario
     */
    function getCertificatesOf(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }

        return tokenIds;
    }

    /**
     * @dev Bloquea las transferencias para hacer el token soulbound
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // Permite mint (from == address(0)) pero no transferencias
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfer not allowed");
        }

        return super._update(to, tokenId, auth);
    }

    // Override requeridos por Solidity
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
