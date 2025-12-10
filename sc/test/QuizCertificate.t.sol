// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {QuizCertificate} from "../src/QuizCertificate.sol";

contract QuizCertificateTest is Test {
    QuizCertificate public certificate;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        certificate = new QuizCertificate();
    }

    function test_MintCertificate() public {
        uint256 tokenId = certificate.mintCertificate(
            user1,
            "TypeScript Basics",
            8,
            10,
            "beginner",
            "typescript"
        );

        assertEq(tokenId, 1);
        assertEq(certificate.balanceOf(user1), 1);
        assertEq(certificate.ownerOf(tokenId), user1);
    }

    function test_CertificateData() public {
        uint256 tokenId = certificate.mintCertificate(
            user1,
            "Solidity Security",
            4,
            5,
            "advanced",
            "solidity"
        );

        (
            string memory quizName,
            uint256 score,
            uint256 totalQuestions,
            uint256 timestamp,
            string memory difficulty,
            string memory category
        ) = certificate.certificates(tokenId);

        assertEq(quizName, "Solidity Security");
        assertEq(score, 4);
        assertEq(totalQuestions, 5);
        assertGt(timestamp, 0);
        assertEq(difficulty, "advanced");
        assertEq(category, "solidity");
    }

    function test_CannotTransfer() public {
        uint256 tokenId = certificate.mintCertificate(
            user1,
            "Docker Basics",
            10,
            10,
            "beginner",
            "docker"
        );

        vm.prank(user1);
        vm.expectRevert("Soulbound: Transfer not allowed");
        certificate.transferFrom(user1, user2, tokenId);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert();
        certificate.mintCertificate(
            user2,
            "Test Quiz",
            5,
            10,
            "intermediate",
            "test"
        );
    }

    function test_UpdateScoreIfBetter() public {
        // First attempt: 60%
        uint256 tokenId1 = certificate.mintCertificate(
            user1,
            "TypeScript Advanced",
            3,
            5,
            "advanced",
            "typescript"
        );

        (, uint256 score1,,,, ) = certificate.certificates(tokenId1);
        assertEq(score1, 3);

        // Second attempt: 80% (better)
        uint256 tokenId2 = certificate.mintCertificate(
            user1,
            "TypeScript Advanced",
            4,
            5,
            "advanced",
            "typescript"
        );

        // Should return same token ID
        assertEq(tokenId1, tokenId2);

        // Score should be updated
        (, uint256 score2,,,, ) = certificate.certificates(tokenId1);
        assertEq(score2, 4);
    }

    function test_DoNotUpdateScoreIfWorse() public {
        // First attempt: 80%
        uint256 tokenId1 = certificate.mintCertificate(
            user1,
            "Docker Compose",
            4,
            5,
            "intermediate",
            "docker"
        );

        (, uint256 score1,,,, ) = certificate.certificates(tokenId1);
        assertEq(score1, 4);

        // Second attempt: 60% (worse)
        uint256 tokenId2 = certificate.mintCertificate(
            user1,
            "Docker Compose",
            3,
            5,
            "intermediate",
            "docker"
        );

        // Should return same token ID
        assertEq(tokenId1, tokenId2);

        // Score should NOT be updated
        (, uint256 score2,,,, ) = certificate.certificates(tokenId1);
        assertEq(score2, 4); // Still the original better score
    }

    function test_GetCertificatesOf() public {
        // Mint 3 certificates for user1
        certificate.mintCertificate(user1, "Quiz 1", 8, 10, "beginner", "typescript");
        certificate.mintCertificate(user1, "Quiz 2", 7, 10, "intermediate", "solidity");
        certificate.mintCertificate(user1, "Quiz 3", 9, 10, "advanced", "docker");

        // Mint 1 certificate for user2
        certificate.mintCertificate(user2, "Quiz 4", 10, 10, "beginner", "typescript");

        uint256[] memory user1Certs = certificate.getCertificatesOf(user1);
        uint256[] memory user2Certs = certificate.getCertificatesOf(user2);

        assertEq(user1Certs.length, 3);
        assertEq(user2Certs.length, 1);
    }

    function test_TokenURIGeneration() public {
        uint256 tokenId = certificate.mintCertificate(
            user1,
            "Test Quiz",
            8,
            10,
            "intermediate",
            "test"
        );

        string memory uri = certificate.tokenURI(tokenId);

        // URI should not be empty
        assertTrue(bytes(uri).length > 0);

        // URI should start with data:application/json;base64,
        assertTrue(
            keccak256(bytes(substring(uri, 0, 29))) ==
                keccak256(bytes("data:application/json;base64,"))
        );
    }

    function test_RevertOnInvalidRecipient() public {
        vm.expectRevert("Invalid recipient");
        certificate.mintCertificate(
            address(0),
            "Test Quiz",
            8,
            10,
            "beginner",
            "test"
        );
    }

    function test_RevertOnInvalidScore() public {
        vm.expectRevert("Score cannot exceed total questions");
        certificate.mintCertificate(
            user1,
            "Test Quiz",
            11,
            10,
            "beginner",
            "test"
        );
    }

    function test_RevertOnEmptyQuizName() public {
        vm.expectRevert("Quiz name cannot be empty");
        certificate.mintCertificate(
            user1,
            "",
            8,
            10,
            "beginner",
            "test"
        );
    }

    // Helper function to extract substring
    function substring(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
}
