
// using native fetch
// const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let userToken = '';
let adminToken = '';
let complaintId = '';
let userId = '';

const log = (msg) => console.log(`[TEST] ${msg}`);
const error = (msg) => console.error(`[ERROR] ${msg}`);

async function request(method, endpoint, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = {
        method,
        headers,
    };
    if (body) config.body = JSON.stringify(body);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();
        return { status: response.status, data };
    } catch (err) {
        error(`Request failed: ${method} ${endpoint} - ${err.message}`);
        return { status: 500, data: null };
    }
}

async function runTest() {
    log("Starting Full Flow Verification...");

    // 1. Register User
    const userEmail = `citizen_${Date.now()}@test.com`;
    const userPass = 'password123';
    log(`1. Registering User: ${userEmail}`);
    const regRes = await request('POST', '/auth/register', {
        name: 'Citizen John',
        email: userEmail,
        password: userPass,
        role: 'citizen'
    });

    if (regRes.status !== 201) return error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    userId = regRes.data.user._id;
    log("   -> User Registered");

    // 2. Login User
    log("2. Logging in User");
    const loginRes = await request('POST', '/auth/login', {
        email: userEmail,
        password: userPass
    });
    if (loginRes.status !== 200) return error(`Login failed: ${JSON.stringify(loginRes.data)}`);
    userToken = loginRes.data.token;
    log("   -> User Logged In");

    // 3. Register Admin
    const adminEmail = `admin_${Date.now()}@test.com`;
    log(`3. Registering Admin: ${adminEmail}`);
    // Note: Assuming registration allows creating admin or we act as admin. 
    // If explicit 'role' is blocked in register, we might need a seed admin.
    // Let's try registering as admin directly first.
    const regAdminRes = await request('POST', '/auth/register', {
        name: 'Admin Jane',
        email: adminEmail,
        password: userPass,
        role: 'admin'
    });

    if (regAdminRes.status === 201) {
        log("   -> Admin Registered (Self-Registration allowed)");
        const loginAdminRes = await request('POST', '/auth/login', {
            email: adminEmail,
            password: userPass
        });
        adminToken = loginAdminRes.data.token;
    } else {
        log("   -> Admin Registration might be restricted. Checking if we can proceed with just User or need seed.");
        // If we can't register admin, we can't test admin features fully unless we have one.
        // For now, let's proceed with User testing and see.
    }

    if (adminToken) {
        log("   -> Admin Logged In");
    }

    // 4. Create Complaint
    log("4. Creating Complaint");
    const complaintRes = await request('POST', '/complaints', {
        title: 'Broken Streetlight',
        description: 'Light on Main St is flickering',
        category: 'electricity',
        location: 'Main St 123'
    }, userToken);

    if (complaintRes.status !== 201) return error(`Complaint creation failed: ${JSON.stringify(complaintRes.data)}`);
    complaintId = complaintRes.data.complaint._id;
    log(`   -> Complaint Created: ${complaintId}`);

    // 5. User Get My Complaints
    log("5. Verifying 'My Complaints'");
    const myComplaintsRes = await request('GET', '/complaints/my', null, userToken);
    if (myComplaintsRes.data.complaints.find(c => c._id === complaintId)) {
        log("   -> Complaint found in User list");
    } else {
        error("   -> Complaint NOT found in User list");
    }

    if (adminToken) {
        // 6. Admin Get Analytics
        log("6. Admin Checking Analytics (New Endpoint)");
        const analyticsRes = await request('GET', '/complaints/analytics', null, adminToken);
        if (analyticsRes.status === 200) {
            log(`   -> Analytics Fetched. Stats: ${JSON.stringify(analyticsRes.data)}`);
        } else {
            error(`   -> Analytics Fetch Failed: ${analyticsRes.status}`);
        }

        // 7. Admin Update Status
        log("7. Admin Updating Status to 'in_progress'");
        const updateRes = await request('PATCH', `/complaints/${complaintId}/status`, {
            status: 'in_progress'
        }, adminToken);

        if (updateRes.status === 200 && updateRes.data.complaint.status === 'in_progress') {
            log("   -> Status Updated Successfully");
        } else {
            error(`   -> Status Update Failed: ${JSON.stringify(updateRes.data)}`);
        }
    } else {
        log("SKIPPING Admin tests (No Admin Token)");
    }

    // 8. Add Comment (User)
    log("8. User Adding Comment");
    const commentRes = await request('POST', `/comments/${complaintId}`, {
        text: 'Any updates?'
    }, userToken);

    if (commentRes.status === 201) {
        log("   -> Comment Added");
    } else {
        error(`   -> Comment Failed: ${JSON.stringify(commentRes.data)}`);
    }

    // 9. Get Comments
    log("9. Fetching Comments");
    const getCommentsRes = await request('GET', `/comments/${complaintId}`, null, userToken);
    if (getCommentsRes.data.comments && getCommentsRes.data.comments.length > 0) {
        log(`   -> Comments retrieved: ${getCommentsRes.data.comments.length}`);
    } else {
        error("   -> No comments found");
    }

    log("Verification Complete.");
}

runTest();
