# Data Monitoring App
Application to monitor Real Time Data

## Backend Simulator:

Run the backend simulator which will generate the data and on connection with frontend, it will send data to frontend periodically.
 * Connection: Backend spin up a socket server to which frontend is connected via socket client.
 * Frequency: Data is sent as a snapshot to frontend when the frontend makes a connection with backend and then backend sends data on regular frequency ( default 1 s ).
 * Quantity: Total 100 rows data is sent to the frontend every second and each row contains 202 columns in which all values are updating on each iteration.

## Frontend React App:

When Page is loaded, the frontend makes a socket connection with the backend.
 * On connection, the frontend gets the snapshot and it creates the whole table on that data.
 * On getting updates of each row, that row is updated and only updated cells are rerendered.
 * Users can filter the row by adding filters from the filter panel ( above table ).
 * Multiple filters can be added at a time and all will be applied using AND operator
 * Users can remove filters using the Minus (-) button.
 * Users click the Apply button after adding filters to apply the filter on the grid.
 * Users can sort the grid on a column value
 * Clicking on the header applies the sorting in Ascending order.
 * Clicking again the same column will sort in descending order.
 * Clicking again the same column will then remove the sorting.
 * Clicking any other column will move the sorting to another column.

## Installation

Clone the project

```bash
cd data-monitoring-system
npm i
```

## Running Backend

```bash
cd data-monitoring-system
cd backend-simulator
node simultor.js
```

## Running Frontend

```bash
cd data-monitoring-system
npm run dev 
```