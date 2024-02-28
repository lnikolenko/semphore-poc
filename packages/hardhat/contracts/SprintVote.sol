//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.4;

// We import this library to be able to use console.log
import "hardhat/console.sol";


// This is the main building block for smart contracts.
contract SprintVote {
    // Some string type variables to identify the token.
   uint private counter;

    struct Poll {
        uint id;
        address owner;
        uint[] votes;
        address[] voters;
        bool isAnonymous;
        bool isClosed;
    }

    mapping(uint => Poll) private polls;
    /**
     * Contract initialization.
     */
    constructor() {
        counter = 0;
    }

    event PollCreated(address indexed _from, uint indexed _id);

    modifier pollExists(uint _id) {
        Poll storage poll = polls[_id];
        require(poll.id != 0, "Poll is not found, please check poll id!");
        _;
    }

    /**
     * TODO
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function createPoll(bool _isAnonymous) external {
        counter += 1;
        uint[] memory votes;
        address[] memory voters;
        Poll memory poll = Poll(counter, msg.sender, votes, voters, _isAnonymous, false);
        polls[counter] = poll;
        emit PollCreated(msg.sender, counter);
    }

    /**
     * TODO
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function closePoll(uint _id) pollExists(_id) external {
        Poll storage poll = polls[_id];
        require(!poll.isClosed, "Poll is already closed!");
        poll.isClosed = true;
    }

    /**
     * TODO
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function getVotes(uint _id) pollExists(_id) external view returns (uint[] memory) {
        Poll memory poll = polls[_id];
        require(poll.isClosed, "Please close the poll before getting the votes");
        return poll.votes;
    }

    /**
     * TODO
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function vote(uint _id, uint _vote) pollExists(_id) external {
        Poll storage poll = polls[_id];
        require(!poll.isClosed, "You cannot vote on a closed poll!");
        if (!poll.isAnonymous) {
            poll.voters.push(msg.sender);
        }
        poll.votes.push(_vote);
    }
}
