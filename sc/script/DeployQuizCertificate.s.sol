// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {QuizCertificate} from "../src/QuizCertificate.sol";

contract DeployQuizCertificate is Script {
    function run() external returns (QuizCertificate) {
        vm.startBroadcast();

        QuizCertificate certificate = new QuizCertificate();

        console.log("QuizCertificate deployed at:", address(certificate));
        console.log("Owner:", certificate.owner());

        vm.stopBroadcast();

        return certificate;
    }
}
