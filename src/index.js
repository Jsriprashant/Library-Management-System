import connectDb from "./db/index.js";
import dotenv from 'dotenv'
dotenv.config({ path: './env' })

import { app } from './app.js'

// Connect to the database and start the server
connectDb()
    .then(() => {
        //as connectDb function returns a promise so we are using '.then' method to handle it
        app.on('error', (error) => {
            //app.on is used to handle the error event
            //if there is any error while starting the server then this event will be triggered
            console.log("Error while starting the server : ", error)
            process.exit(1)

        })

        app.listen(process.env.PORT || 8000, () => {
            // if port is present on environment variable then use that port, otherwise use 8000
            console.log(`App listning on port ${process.env.PORT || 8000}`)

        })
    })
    .catch((error) => {
        console.error("MONGO DB CONNECTION ERROR: ", error);
    })
