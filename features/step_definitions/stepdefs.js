const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

/**
 * If today is "Friday" returns "TGIF", otherwise "Nope"
 * @param today
 * @returns {string}
 */
function isItFriday(today) {
    return today === "Friday" ? "TGIF" : "Nope";
}
Given('today is {string}', function (givenDay) {
    this.today = givenDay;
});
When('I ask whether it\'s Friday yet', function () {
    // Write code here that turns the phrase above into concrete actions
    // return 'pending';
    this.actualAnswer = isItFriday(this.today);
});
Then('I should be told {string}', function (expectedAnswer) {
    // Write code here that turns the phrase above into concrete actions
    // return 'pending';
    assert. strictEqual(this.actualAnswer, expectedAnswer);
});

Given('today is Friday', function () {
    this.today = 'Friday';
});
