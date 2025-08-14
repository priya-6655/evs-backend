const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000
const sequelize = require('./src/config/db');

const AdminRoutes = require('./src/routes/admin.routes');
const ElectionRoutes = require('./src/routes/election.routes');
const PartyRoutes = require('./src/routes/party.routes');
const candidateRoutes = require('./src/routes/candidate.routes');
const partyWiseCandi = require('./src/routes/partywiseCandidate.router');


//user Module
const userRoutes = require('./src/routes/user.routes');
const voterRequest = require('./src/routes/voterReq.routes')
const electionResultsRoutes = require('./src/routes/election.results.routes');


const EORoutes = require('./src/routes/EO.routes')

app.use(cors())
app.use(express.json({ limit: "5mb" }))

// admin
app.use('/admin', AdminRoutes);
app.use('/election', ElectionRoutes);
app.use('/party', PartyRoutes)
app.use('/candidate', candidateRoutes)
app.use('/candidateDetails', partyWiseCandi)

//user Module
app.use('/user', userRoutes)
app.use('/voter', voterRequest)
app.use('/electionResults', electionResultsRoutes)


//EO Module

app.use('/ELectoral', EORoutes)

sequelize.sync().then(() => {
    console.log('✅ DB synced');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.error('❌ DB connection error:', err);
});


//Admin email register

app.post('/api/register', (req, res) => {
    const { name, password, email } = req.body
    console.log('Received:', name, password, email)
    res.json({ message: "Email register successfully" })
})






