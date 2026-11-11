// frontend/src/App.jsx
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import StudentDashboard from "./pages/student/Dashboard";
import MentorDirectory from "./pages/student/MentorDirectory";
import DonationsReceived from "./pages/student/DonationsReceived";
import NgoDashboard from "./pages/ngo/Dashboard";
import ProgramForm from "./pages/ngo/ProgramForm";
import NgoApplications from "./pages/ngo/Applications";
import ResourceUpload from "./pages/ngo/ResourceUpload";
import DonorDashboard from "./pages/donor/Dashboard";
import Donate from "./pages/donor/Donate";
import Receipts from "./pages/donor/Receipts";
import MentorDashboard from "./pages/mentor/Dashboard";
import ScheduleSession from "./pages/mentor/ScheduleSession";
import MentorResourceUpload from "./pages/mentor/ResourceUpload";
import Approvals from "./pages/admin/Approvals";
import AdminUsers from "./pages/admin/Users";
import AdminPrograms from "./pages/admin/Programs";
import AdminDonations from "./pages/admin/Donations";
import Analytics from "./pages/admin/Analytics";
import NotFound from "./pages/NotFound";

function guard(roles, element) {
  return <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="programs" element={<Programs />} />
        <Route path="programs/:id" element={<ProgramDetail />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={guard(["student", "ngo", "donor", "mentor", "admin"], <Profile />)} />
        <Route path="notifications" element={guard(["student", "ngo", "donor", "mentor", "admin"], <Notifications />)} />

        <Route path="student" element={guard(["student"], <StudentDashboard />)} />
        <Route path="student/mentors" element={guard(["student"], <MentorDirectory />)} />
        <Route path="student/donations" element={guard(["student"], <DonationsReceived />)} />

        <Route path="ngo" element={guard(["ngo"], <NgoDashboard />)} />
        <Route path="ngo/programs/new" element={guard(["ngo"], <ProgramForm />)} />
        <Route path="ngo/programs/:id/edit" element={guard(["ngo"], <ProgramForm />)} />
        <Route path="ngo/applications" element={guard(["ngo"], <NgoApplications />)} />
        <Route path="ngo/resources" element={guard(["ngo"], <ResourceUpload />)} />

        <Route path="donor" element={guard(["donor"], <DonorDashboard />)} />
        <Route path="donor/donate" element={guard(["donor"], <Donate />)} />
        <Route path="donor/receipts" element={guard(["donor"], <Receipts />)} />

        <Route path="mentor" element={guard(["mentor"], <MentorDashboard />)} />
        <Route path="mentor/sessions/new" element={guard(["mentor"], <ScheduleSession />)} />
        <Route path="mentor/resources" element={guard(["mentor"], <MentorResourceUpload />)} />

        <Route path="admin/approvals" element={guard(["admin"], <Approvals />)} />
        <Route path="admin/users" element={guard(["admin"], <AdminUsers />)} />
        <Route path="admin/programs" element={guard(["admin"], <AdminPrograms />)} />
        <Route path="admin/donations" element={guard(["admin"], <AdminDonations />)} />
        <Route path="admin/analytics" element={guard(["admin"], <Analytics />)} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
