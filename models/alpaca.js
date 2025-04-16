const axios = require('axios');
require('dotenv').config();
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Alpaca {

  /**
   * Creates an account in alpaca with a starting amount of money.
   * 
   * API Doc Link for 'Create an Account': https://docs.alpaca.markets/reference/createaccount
   * 
   * API Doc Link for 'Create an ACH Relationship': https://docs.alpaca.markets/reference/createachrelationshipforaccount
   * 
   * API Doc Link for 'Request a New Transfer': https://docs.alpaca.markets/reference/createtransferforaccount
   * 
   * @returns {{ accountId: string, achRelationshipId: string }|null} Returns the created alpaca account id and the ach relationship id, 
   * or null if the process fails at any point.
   */
  async createAccount() {

    const random_number = getRandomInt(9999999999)
    const initial_amount = '10000'

    const create_account_options = {
      method: 'POST',
      url: 'https://broker-api.sandbox.alpaca.markets/v1/accounts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='
      },
      data: {

        "contact": {
          "email_address": `fake_${random_number}@example.com`,
          "phone_number": "313-555-0947",
          "street_address": [
            "20 N San Mateo Dr"
          ],
          "city": "San Mateo",
          "state": "CA",
          "postal_code": "94401"
        },
        "identity": {
          "given_name": "Clever",
          "family_name": "Driscoll",
          "date_of_birth": "1970-01-01",
          "country_of_citizenship": "USA",
          "country_of_birth": "USA",
          "party_type": "",
          "tax_id": "444-55-4321",
          "tax_id_type": "USA_SSN",
          "country_of_tax_residence": "USA",
          "funding_source": [
            "employment_income"
          ]
        },
        "disclosures": {
          "is_control_person": false,
          "is_affiliated_exchange_or_finra": false,
          "is_affiliated_exchange_or_iiroc": false,
          "is_politically_exposed": false,
          "immediate_family_exposed": false,
          "is_discretionary": null
        },
        "agreements": [
          {
            "agreement": "customer_agreement",
            "signed_at": "2025-04-11T06:23:13.992751709Z",
            "ip_address": "127.0.0.1"
          }
        ],
        "documents": [
          {
            "document_type": "identity_verification",
            "document_sub_type": "passport",
            "content": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==",
            "content_data": null,
            "mime_type": "image/jpeg"
          }
        ],
        "trusted_contact": {
          "given_name": "Jane",
          "family_name": "Doe",
          "email_address": "clever_driscoll_67419643@example.com"
        },
        "minor_identity": null,
        "entity_id": null,
        "additional_information": "",
        "account_type": "",
        "account_sub_type": null,
        "trading_type": null,
        "auto_approve": null,
        "beneficiaries": null,
        "trading_configurations": null,
        "currency": null,
        "enabled_assets": null,
        "instant": null,
        "authorized_individuals": null,
        "ultimate_beneficial_owners": null,
        "sub_correspondent": null,
        "primary_account_holder_id": null

      }
    };

    console.debug('Creating alpaca account...')
    let response

    try {
      response = await axios.request(create_account_options);
    } catch (error) {
      console.error(error.response.data);
      return null
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    const accountId = response.data.id

    const create_account_relationship_options = {
      method: 'POST',
      url: `https://broker-api.sandbox.alpaca.markets/v1/accounts/${accountId}/ach_relationships`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='
      },
      data: {
        "account_owner_name": "fake",
        "bank_account_type": "CHECKING",
        "bank_account_number": "32131231abc",
        "bank_routing_number": "123103716",
        "nickname": "Fake checking account",
        "instant": true
      }
    };

    console.debug('Creating alpaca bank account relationship...')

    try {
      response = await axios.request(create_account_relationship_options);
    } catch (error) {
      console.error(error.response.data);
      return null
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    const achRelationshipId = response.data.id

    const create_transfer_optoins = {
      method: 'POST',
      url: `https://broker-api.sandbox.alpaca.markets/v1/accounts/${accountId}/transfers`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='

      },
      data: {
        transfer_type: 'ach',
        direction: 'INCOMING',
        timing: 'immediate',
        relationship_id: achRelationshipId,
        amount: initial_amount
      }
    }

    console.log(`Transferring ${initial_amount} into account...`)

    try {
      response = await axios.request(create_transfer_optoins);
    } catch (error) {
      console.error(error.response.data);
      return null
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    return {accountId, achRelationshipId}
  }
  
  /**
   * Gives the given account additional money. Takes a while to process.
   * 
   * @param {string} accountId 
   * @param {string} achRelationshipId The relationship id from the create account method.
   * @param {string} amount Amount of money to give.
   * @returns 
   */
  async requestNewTransfer(accountId, achRelationshipId, amount) {

    const create_transfer_optoins = {
      method: 'POST',
      url: `https://broker-api.sandbox.alpaca.markets/v1/accounts/${accountId}/transfers`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='
      },
      data: {
        transfer_type: 'ach',
        direction: 'INCOMING',
        timing: 'immediate',
        relationship_id: achRelationshipId,
        amount: amount
      }
    }

    console.log(`Transferring ${initial_amount} into account...`)

    try {
      response = await axios.request(create_transfer_optoins);
    } catch (error) {
      console.error(error.response.data);
      return false
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    return true
  }

  /**
   * Creates an order to buy/sell a stock for the given account.
   * 
   * API Doc Link: https://docs.alpaca.markets/reference/createorderforaccount
   * 
   * @param {string} accountId 
   * @param {string} symbol Stock symbol (ex: AAPL)
   * @param {string|null} quantity Quantity of stock
   * @param {string|null} notional Money amount of stock
   * @param {string} side Must be string literal 'buy' or 'sell', buying or sellling the stock.
   * @returns {bool} Returns true if the request went through, false if there was an error.
   */
  async createOrder(accountId, symbol, quantity, notional, side) {
    if (side !== 'buy' && side !== 'sell') {
      console.error('Parameter `side` must be "buy" or "sell". Got: ', side);
      return false;
    }

    if (quantity && notional) {
      console.error('Parameters `quantity` and `notional` are exclusive, cannot have both.')
      return false;
    }


    const options = {
      method: 'POST',
      url: `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${accountId}/orders`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='
      },
      data: {
        type: 'market',
        time_in_force: 'day',
        commission_type: 'notional',
        extended_hours: false,
        side: side,
        symbol: symbol
      }
    }
    
    // if wanting to buy through quantity of stock or set cash amount
    if (quantity) {
      options.data.qty = quantity
    } else {
      options.data.notional = notional
    }

    let response

    try {
      response = await axios.request(options);
    } catch (error) {
      console.error(error.response.data);
      return false;
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    return true;
  }

  /**
   * Cancels all orders for an account. Useful for testing.
   * 
   * API Doc Link: https://docs.alpaca.markets/reference/deleteallordersforaccount-1
   * 
   * @param {string} accountID 
   * @returns {bool} Returns true if the request went through, false if there was an error.
   */
  async cancelAllOrders(accountId) {

    const options = {
      method: 'DELETE',
      url: `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${accountId}/orders`,
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='
      }
    };

    let response

    try {
      response = await axios.request(options);
    } catch (error) {
      console.error(error.response.data);
      return false
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    return true;

  }

  /**
   * List the open positions on a given account.
   * 
   * API Doc Link: https://docs.alpaca.markets/reference/getpositionsforaccount-1
   * 
   * @param {string} accountID 
   * @returns {Object[]|null} Returns an array of objects that contain the held stock info, or null if error occured. 
   */
  async listOpenPositions(accountId) {

    const options = {
      method: 'GET',
      url: `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${accountId}/positions`,
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='
      }
    };


    let response

    try {
      response = await axios.request(options);
    } catch (error) {
      console.error(error.response.data);
      return null;
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    return response.data

  }

  /**
   * Gets the portfolio history for a given account. Check the doc link for the output format.
   * 
   * API Doc Link: https://docs.alpaca.markets/reference/getpositionsforaccount-1
   * 
   * @param {string} accountID 
   * @returns {bool} Returns true if the request went through, false if there was an error.
   */
  async getPortfolioHistory(accountID) {
    const options = {
      method: 'GET',
      url: `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${accountID}/account/portfolio/history?period=1D&timeframe=1H&intraday_reporting=continuous&pnl_reset=per_day`,
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0syVzlDUkZOM1VHV0RRQ0oySUg6MGRiYldxY1NBb0d3MjdmRzcyRG1RWldNNlpLVjBnRHQ4VDFEaFBYTA=='

      }
    };

    let response

    try {
      response = await axios.request(options);
    } catch (error) {
      console.error(error.response.data);
      return null;
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    // The timestamps are in the UNIX time, here is an example of how to convert it to pacific:

    // const timestamp = 1744405200; // example Unix epoch (in seconds)
    // const date = new Date(timestamp * 1000); // convert to milliseconds

    // const pacificTime = new Intl.DateTimeFormat("en-US", {
    //   timeZone: "America/Los_Angeles",
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   second: "2-digit",
    //   hour12: false
    // }).format(date);

    // console.log(pacificTime); // formatted in Pacific Time

    return response.data;
  }

  async getOpenOrders(accountID) {
    const options = {
      method: 'GET',
      url: `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${accountID}/orders`,
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0tHMkRZMTEzRFk4WUVDMVk3R1Q6NDhaUWxRZFlpNmNZNjdFWEJWY0wwaGVwcjRxeTliNHdmZkpUMVNEQw=='
      }
    };
    
    let response

    try {
      response = await axios.request(options);
    } catch (error) {
      console.error(error.response.data);
      return null;
    }

    console.debug('Status code: ', response.status);
    console.debug('Response Data: ', response.data);

    return response.data
  }
    /**
   * Fetches stock details like current price, change %, and exchange info
   * using Alpaca's Market Data API v2.
   *
   * @param {string} symbol Stock symbol (e.g., AAPL)
   * @returns {object|null} Stock data
   */
    async getStockDetails(symbol) {
          const stockBaseUrl = 'https://data.alpaca.markets/v2/stocks';
          const assetBaseUrl = 'https://paper-api.alpaca.markets/v2/assets';
          const headers = {
            'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
            'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY,
          };
        
          try {
            // ✅ 1. Get snapshot (price data)
            const snapshotUrl = `${stockBaseUrl}/${symbol}/snapshot`;
            const snapshotRes = await axios.get(snapshotUrl, { headers });
        
            const snapshot = snapshotRes.data;
            const latest = snapshot.latestTrade?.p || 0;
            const open = snapshot.dailyBar?.o || 0;
            const changePercent = open ? (((latest - open) / open) * 100).toFixed(2) : 0;
        
            // ✅ 2. Get asset info (company name, exchange, etc.)
            const assetUrl = `${assetBaseUrl}/${symbol}`;
            const assetRes = await axios.get(assetUrl, { headers });
            const asset = assetRes.data;
        
            return {
              name: asset.name || symbol,
              price: latest.toFixed(2),
              changePercent,
              exchange: asset.exchange || 'N/A',
              assetClass: asset.class || 'us_equity'
            };
        
          } catch (error) {
            console.error(`Alpaca Market Data Error [${symbol}]:`, error.response?.data || error.message);
            return null;
          }
        }
}

// example of how to incur

// const alpaca = new Alpaca();

// alpaca.createAccount().then(result => {console.log(result)})
// alpaca.createOrder("68c43f83-af08-4cca-93d8-e0e6e18a8568", "AAPL", 1, null, "buy").then(result => {console.log(result)})
// alpaca.cancelAllOrders("68c43f83-af08-4cca-93d8-e0e6e18a8568")
// alpaca.getPortfolioHistory("68c43f83-af08-4cca-93d8-e0e6e18a8568")

module.exports = Alpaca;
