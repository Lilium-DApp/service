# Running

Our project was developed with typescript and Node.js. In the project folder, install the dependencies with the command:

```bash
npm install
```

The main dependencies used are:

-   `typescript`: Superset of JavaScript that adds types to the language
-   `express`: Web framework for Node.js
-   `mqtt`: MQTT library for communication with the Cartesi Machine
-   `ethers`: Ethereum library for interacting with the blockchain
-   `@cartesi/rollups`: Cartesi's rollup library for access the contracts

To run the project:

-   Dev
    ```bash
    npm run dev
    ```
-   Production
    ```bash
    npm run build
    npm start
    ```
