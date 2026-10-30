Feature: Authentication
  As a store customer
  I want to sign in
  So that I can browse products

  @smoke
  Scenario: BDD-01 Valid customer reaches inventory
    Given the SauceDemo login page is open
    When I sign in with the standard demo user
    Then the product inventory is displayed

  Scenario Outline: BDD-02 Invalid customers see a useful error
    Given the SauceDemo login page is open
    When I sign in with username "<username>" and password "<password>"
    Then the login error contains "<message>"

    Examples:
      | username        | password     | message                            |
      | locked_out_user | secret_sauce | locked out                         |
      | unknown_user    | wrong        | Username and password do not match |
