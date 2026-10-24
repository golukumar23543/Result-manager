import { useEffect } from 'react';
import { ArrowLeft, Printer, ShieldCheck, Lock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface LegalDocProps {
  onBack: () => void;
  onNavigateToTerms?: () => void;
}

export default function PrivacyPolicy({ onBack, onNavigateToTerms }: LegalDocProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:text-slate-900 print:py-0 print:px-0">
      {/* Top Navigation Bar - Hidden in Print */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 font-semibold transition-all shadow hover:shadow-sky-500/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Result Portal</span>
        </button>

        <div className="flex items-center gap-3">
          {onNavigateToTerms && (
            <button
              onClick={onNavigateToTerms}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer"
            >
              View Terms &amp; Conditions
            </button>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="max-w-5xl mx-auto bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-10 lg:p-14 shadow-2xl print:shadow-none print:border-none print:bg-white print:p-0">
        
        {/* Institutional Header & Document Metadata */}
        <header className="border-b-2 border-slate-700/80 pb-8 mb-8 text-center print:border-slate-300">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 print:hidden">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-indigo-400 print:text-slate-600 mb-1">
            Institutional Data Governance &bull; Student Privacy Notice
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white print:text-black mb-3">
            Institutional Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-slate-300 print:text-slate-700 font-medium max-w-3xl mx-auto">
            Comprehensive Privacy Standards, Record Governance, and Information Safeguards for NSIT Semester Examination Result Portal
          </p>
          
          <div className="mt-6 pt-4 border-t border-slate-800/60 print:border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm text-left text-slate-400 print:text-slate-600">
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Controller Entity:</span>
              <span>Netaji Subhas Institute of Technology (NSIT)</span>
            </div>
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Supervisory Unit:</span>
              <span>Office of the Controller of Examinations, NSIT Patna</span>
            </div>
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Effective Date:</span>
              <span>Academic Session 2025–2026 (Effective October 2026)</span>
            </div>
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Privacy Revision:</span>
              <span>Annual Cycle 2026/V.2</span>
            </div>
          </div>

          {/* Important Institutional Disclaimer Notice */}
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 print:bg-amber-50 print:border-amber-300 print:text-amber-900 text-xs sm:text-sm text-left flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block mb-1">Authenticity &amp; Privacy Architecture Disclaimer:</span>
              <span>
                Netaji Subhas Institute of Technology (NSIT) is an autonomous/affiliated educational institution and this Portal operates as an internal academic administration system. The institution does not represent, nor is it chartered as, a government ministry or statutory state certification bureau. In this result portal design, a student&apos;s allocated roll number acts as the look-up key and access credential. Because college roll numbers are sequentially allotted and frequently visible on attendance registers or class rosters, students and guardians are explicitly informed that this setup does not provide confidential cryptographic secrecy.
              </span>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        <section className="mb-10 p-6 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:break-after-page">
          <h2 className="text-base sm:text-lg font-bold text-white print:text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            Privacy Policy Table of Contents
          </h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-indigo-400 print:text-indigo-800">
            <a href="#priv-sec-1" className="hover:underline flex items-center gap-1.5 py-1"><span>1.</span> Scope, Governance, and Objectives</a>
            <a href="#priv-sec-2" className="hover:underline flex items-center gap-1.5 py-1"><span>2.</span> Institutional Identity &amp; Contact Details</a>
            <a href="#priv-sec-3" className="hover:underline flex items-center gap-1.5 py-1"><span>3.</span> Categories of Student Information Processed</a>
            <a href="#priv-sec-4" className="hover:underline flex items-center gap-1.5 py-1"><span>4.</span> Lawful Grounds and Purposes of Processing</a>
            <a href="#priv-sec-5" className="hover:underline flex items-center gap-1.5 py-1"><span>5.</span> Roll Number Credential Architecture &amp; Privacy Risks</a>
            <a href="#priv-sec-6" className="hover:underline flex items-center gap-1.5 py-1"><span>6.</span> Administrative Access &amp; Role Separation</a>
            <a href="#priv-sec-7" className="hover:underline flex items-center gap-1.5 py-1"><span>7.</span> Cloud Datastore &amp; Third-Party Processors</a>
            <a href="#priv-sec-8" className="hover:underline flex items-center gap-1.5 py-1"><span>8.</span> Cookies, Web Storage &amp; Telemetry Absence</a>
            <a href="#priv-sec-9" className="hover:underline flex items-center gap-1.5 py-1"><span>9.</span> Data Retention Schedules &amp; Academic Archives</a>
            <a href="#priv-sec-10" className="hover:underline flex items-center gap-1.5 py-1"><span>10.</span> Student Data Subject Entitlements &amp; Rectification</a>
            <a href="#priv-sec-11" className="hover:underline flex items-center gap-1.5 py-1"><span>11.</span> Technical Safeguards &amp; Security Protocols</a>
            <a href="#priv-sec-12" className="hover:underline flex items-center gap-1.5 py-1"><span>12.</span> Lawful Disclosures &amp; Educational Verification</a>
            <a href="#priv-sec-13" className="hover:underline flex items-center gap-1.5 py-1"><span>13.</span> Protection of Minor Students&apos; Data</a>
            <a href="#priv-sec-14" className="hover:underline flex items-center gap-1.5 py-1"><span>14.</span> Policy Audits, Updates &amp; Notifications</a>
            <a href="#priv-sec-15" className="hover:underline flex items-center gap-1.5 py-1"><span>15.</span> Grievance Officer, Redressal Cell &amp; Jurisdiction</a>
          </nav>
        </section>

        {/* Substantive Sections (1 through 15) */}
        <div className="space-y-10 text-slate-300 print:text-slate-800 text-sm sm:text-base leading-relaxed">

          {/* Section 1 */}
          <section id="priv-sec-1" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              1. Scope, Institutional Governance, and Policy Objectives
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>1.1 Policy Mandate:</strong> This Privacy Policy articulates the comprehensive data handling standards, procedural controls, and legal frameworks observed by <strong>Netaji Subhas Institute of Technology (NSIT)</strong> in relation to the collection, storage, indexing, presentation, and archival of candidate examination records on <strong>NSIT Semester Examination Result Portal</strong>.
              </p>
              <p>
                <strong>1.2 Applicability:</strong> This Policy applies strictly to all electronic data elements entered by administrative controllers, queries submitted by matriculated candidates, and session interactions conducted through this web application. It governs every semester cycle including regular terms, supplementary evaluation cycles, carry-over assessments, and remedial examinations.
              </p>
              <p>
                <strong>1.3 Reading in Conjunction:</strong> This Privacy Policy is inextricably linked with the institutional <em>Terms and Conditions of Use</em> and the statutory <em>Examination Code of Conduct</em> enacted by the <strong>Office of the Controller of Examinations, NSIT Patna</strong>.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="priv-sec-2" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              2. Institutional Identity, Legal Capacity, and Contact Information
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>2.1 Data Controller Identity:</strong> The legal entity responsible for determining the purposes and means of student data processing under this Portal is:
              </p>
              <div className="bg-slate-950/60 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 text-xs sm:text-sm space-y-1">
                <p><strong>Educational Institution:</strong> Netaji Subhas Institute of Technology (NSIT)</p>
                <p><strong>Campus Headquarters:</strong> Amhara, Bihta, Patna, Bihar - 801106, India</p>
                <p><strong>Supervising Authority:</strong> Office of the Controller of Examinations</p>
                <p><strong>Official Electronic Mail:</strong> coe@nsit.ac.in</p>
                <p><strong>Institutional Helpdesk:</strong> +91 91024 03265</p>
              </div>
              <p>
                <strong>2.2 Non-Affiliation with Central Ministries:</strong> The Institution explicitly records that it is an academic establishment and is neither a department of the central federal government nor a statutory civil intelligence bureau. Any references to official ledgers refer strictly to internal collegiate registers and university-affiliated examination tabulation records.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="priv-sec-3" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              3. Categories of Academic and Student Information Processed
            </h3>
            <div className="space-y-3.5">
              <p>
                To provide transparent electronic result publication, NSIT Semester Examination Result Portal processes specific, delimited categories of academic and identification data:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Direct Student Identifiers:</strong> Assigned College Roll Number (e.g., <code>89251001</code>), short institutional serial suffix, and full candidate name as recorded in official matriculation registers.
                </li>
                <li>
                  <strong>Academic Performance Metrics:</strong> Semester designations (e.g., Semester 1 through Semester 8), examination session categories (Regular, Re-appear, Supplementary), total marks scored, maximum attainable marks, Semester Grade Point Average (SGPA), and Cumulative Grade Point Average (CGPA).
                </li>
                <li>
                  <strong>Course Progression Status:</strong> Clear status determinations (&quot;Cleared&quot;, &quot;Carry&quot;, &quot;Withheld&quot;), lists of backlog or carry subjects requiring re-appearance, and moderation notes.
                </li>
                <li>
                  <strong>Document Transcripts:</strong> Digitally generated or uploaded Base64-encoded PDF provisional marksheets and optional profile photographs uploaded by administrative staff for candidate verification.
                </li>
                <li>
                  <strong>Credential and Access Tokens:</strong> Student access passcodes (where configured by administrators) and administrative master credential verifiers.
                </li>
                <li>
                  <strong>System Audit Metadata:</strong> Timestamps of document creation (<code>createdAt</code> server timestamps), record modification records, and query retrieval activity.
                </li>
              </ul>
              <p>
                <strong>3.2 Data Not Collected:</strong> The Portal does not collect financial debit/credit card credentials, biometric fingerprints, iris scans, geolocation GPS coordinates, social media profiles, or third-party advertising identifiers.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="priv-sec-4" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              4. Lawful Grounds and Specific Purposes of Processing
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>4.1 Lawful Basis:</strong> All processing of student data on this Platform is conducted strictly pursuant to the following lawful grounds recognized under educational administrative law:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Academic Contractual Performance:</strong> Necessary for the administration of degree curricula, academic evaluation, and the timely communication of examination outcomes to enrolled candidates.
                </li>
                <li>
                  <strong>Statutory and Regulatory Compliance:</strong> Fulfilling mandates established by university affiliating ordinances requiring public display of provisional tabulation registers.
                </li>
                <li>
                  <strong>Legitimate Institutional Interests:</strong> Ensuring transparency, mitigating errors in manual marksheet issuance, and enabling students to petition for re-evaluation within designated timelines.
                </li>
              </ul>
              <p>
                <strong>4.2 Absolute Commercial Prohibition:</strong> The Institution never sells, leases, monetizes, or shares student records or contact details with commercial marketing firms, private lenders, or advertising syndicates.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="priv-sec-5" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              5. Roll Number Credential Architecture, Inherent Risks, and Security Guidance
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>5.1 Technical Architecture Disclosure:</strong> In the current implementation of NSIT Semester Examination Result Portal, the candidate&apos;s allocated College Roll Number (e.g., <code>89251001</code>) functions as both the primary search index and the direct access key for provisional examination files.
              </p>
              <p>
                <strong>5.2 Risk Assessment Regarding Predictable Roll Sequences:</strong> Because collegiate roll numbers are allotted systematically in sequential ascending blocks within departments, students frequently know or can deduce the roll numbers of classmates. The Institution emphasizes the following critical considerations:
              </p>
              <div className="p-4 rounded-xl bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-rose-300 print:text-rose-800">
                  &bull; Absence of Strong Cryptographic Confidentiality:
                </p>
                <p>
                  A roll number alone does not satisfy the criteria of an unguessable cryptographic password. If confidentiality against peers is an absolute necessity for a candidate, the roll-number scheme alone is insufficient.
                </p>
                <p className="font-semibold text-sky-300 print:text-sky-800">
                  &bull; Recommendations for Enhanced Individual Privacy:
                </p>
                <p>
                  The Institution strongly advises that students utilize custom password features when unlocked by administrators. The Institution is actively engineering supplementary authentication mechanisms, including independent secret PIN codes, university email verification, and time-based One-Time Passwords (OTPs).
                </p>
              </div>
              <p>
                <strong>5.3 Prohibition of Peer Snooping:</strong> Entering another candidate&apos;s roll number to view their academic marks without express, verifiable consent constitutes an actionable breach of institutional codes and will be referred to the Proctorial Board.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="priv-sec-6" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              6. Administrative Access Controls and Role-Based Separation
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>6.1 Segregation of Administrative Functions:</strong> The Portal maintains strict role-based separation between student query capabilities and administrative modification faculties.
              </p>
              <p>
                <strong>6.2 Admin Panel Security:</strong> Administrative functionalities—including the ability to upload new semester results, edit student marks, attach provisional PDF documents, upload candidate photographs, or update roll passcodes—are protected behind a multi-step administrative gateway requiring verified passcodes known only to authorized examination officers.
              </p>
              <p>
                <strong>6.3 Concealed Administrative Controls:</strong> To prevent unauthorized automated scraping or casual tampering attempts on shared terminals, administrative login controls are intentionally concealed behind authenticated institutional interaction sequences.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="priv-sec-7" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              7. Cloud Datastore, Infrastructure Providers, and Sub-Processors
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>7.1 Managed Cloud Hosting:</strong> To ensure high availability and resilient database queries across thousands of concurrent requests, NSIT Semester Examination Result Portal utilizes secure cloud datastore services provided by Google Cloud Platform / Firebase Firestore.
              </p>
              <p>
                <strong>7.2 Sub-Processor Standards:</strong> Our cloud infrastructure provider operates under stringent international security certifications (such as ISO/IEC 27001, SOC 2, and SOC 3). Student data stored within cloud tables is encrypted at rest using AES-256 standards and protected in transit across public networks using TLS 1.3 cryptographic protocols.
              </p>
              <p>
                <strong>7.3 Client-Side Execution Boundary:</strong> Result lookups, PDF rendering previews, and student profile displays are executed directly within the user&apos;s client browser environment. Marks data is transferred securely between the cloud database and the student&apos;s local browser session without passing through unauthorized middleman proxies.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="priv-sec-8" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              8. Cookies, Local Browser Storage, and Telemetry Absence
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>8.1 Zero Commercial Tracking:</strong> NSIT Semester Examination Result Portal does not utilize third-party commercial advertising cookies, tracking pixels, behavioral fingerprinting scripts, or cross-site behavioral telemetry.
              </p>
              <p>
                <strong>8.2 Essential Session Storage:</strong> The Portal may temporarily utilize ephemeral browser session memory or local storage solely for the technical execution of:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Caching unlocked roll-number statuses during an active browsing tab to prevent redundant password prompts.</li>
                <li>Maintaining temporary administrative login tokens for authorized examination officers.</li>
              </ul>
              <p>
                All local session memory is automatically cleared upon closing the browser tab or clicking the logout option.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="priv-sec-9" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              9. Data Retention Schedules and Permanent Academic Archives
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>9.1 Permanent Academic Ledgers:</strong> In accordance with statutory university mandates, records of academic examination performance, semester marks, credit allocations, and degree awards are preserved permanently in the official collegiate archives to facilitate future degree verification, employment checks, and duplicate transcript issuance throughout the candidate&apos;s lifetime.
              </p>
              <p>
                <strong>9.2 Digital Portal Retention:</strong> Electronic records published on NSIT Semester Examination Result Portal remain active across all semesters of a student&apos;s degree lifecycle. Historical archives may be indexed or placed in cold cloud storage following formal convocation, subject to institutional IT policies.
              </p>
              <p>
                <strong>9.3 Temporary File Purging:</strong> Staged files, orphaned temporary uploads, and failed upload fragments are routinely purged from cloud caches every ninety (90) days.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="priv-sec-10" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              10. Student Data Subject Entitlements and Rectification Rights
            </h3>
            <div className="space-y-3.5">
              <p>
                Matriculated candidates and their lawful guardians possess defined institutional entitlements regarding personal data maintained on the Portal:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Right of Inspection:</strong> The right to view personal semester marks, SGPA computations, and registered module codes upon submission of valid roll credentials.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> The right to petition for the immediate correction of typographical errors in candidate names, misspelled father/mother details, or incorrect subject codes.
                </li>
                <li>
                  <strong>Right to Formal Scrutiny:</strong> The right to apply for marks re-checking or re-evaluation in accordance with the timelines and fee schedules established in the <em>Terms and Conditions</em>.
                </li>
                <li>
                  <strong>Limitation Regarding Erasure:</strong> Because examination records form an indelible part of institutional academic certification, students may not demand the unilateral deletion or erasure of legitimately earned marks or carry backlog records from the college database.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section id="priv-sec-11" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              11. Technical Safeguards, Data Integrity, and Incident Protocols
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>11.1 Defense-in-Depth Measures:</strong> Netaji Subhas Institute of Technology (NSIT) deploys reasonable administrative, physical, and technical safeguards to preserve data integrity and protect records against accidental loss, unauthorized access, or unauthorized alteration:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Enforced Hypertext Transfer Protocol Secure (HTTPS) with TLS encryption for all client-server communications.</li>
                <li>Database write protections configured to allow record mutations exclusively through authenticated administrative channels.</li>
                <li>Audit trails documenting changes to semester records, mark adjustments, and PDF attachments.</li>
              </ul>
              <p>
                <strong>11.2 Incident Response Protocol:</strong> In the extraordinary event that a data exposure or unauthorized database intrusion is confirmed, the Office of the Controller of Examinations, NSIT Patna will initiate incident containment protocols, isolate affected database collections, report to college leadership, and notify affected candidates in accordance with statutory guidelines.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="priv-sec-12" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              12. Lawful Disclosures, Regulatory Transmissions, and Third Parties
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>12.1 Regulatory and Educational Bodies:</strong> The Institution may transmit candidate marks and academic profiles to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The Affiliating University and University Grants / Higher Education Councils.</li>
                <li>National Academic Depository (NAD) platforms or digital locker frameworks where required by law.</li>
                <li>Official scholarship boards, government welfare departments, or accredited credential verification agencies verifying student credentials with candidate authorization.</li>
              </ul>
              <p>
                <strong>12.2 Court Orders and Subpoenas:</strong> The College will disclose examination records to law enforcement agencies or judicial courts only upon receipt of a valid, binding court order, warrant, or statutory summons.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="priv-sec-13" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              13. Special Protections for Minor and Vulnerable Students
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>13.1 Adolescent and Minor Candidates:</strong> Certain students matriculating in introductory diploma or undergraduate programs may be under eighteen (18) years of age. Netaji Subhas Institute of Technology (NSIT) exercises heightened diligence in handling minor students&apos; records.
              </p>
              <p>
                <strong>13.2 Parental and Guardian Access:</strong> Natural parents and lawful legal guardians possess the recognized right to inquire about and review the academic progress and semester marks of their minor dependents through the Office of the Controller of Examinations, NSIT Patna.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="priv-sec-14" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              14. Periodic Institutional Reviews, Audits, and Versioning
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>14.1 Annual Policy Audit:</strong> This Privacy Policy undergoes comprehensive institutional review at least once per academic year under the supervision of the Data Governance Committee and Academic Council.
              </p>
              <p>
                <strong>14.2 Publication of Revisions:</strong> Any revisions, expansions, or amendments to data processing protocols will be published directly on this web page with an updated &quot;Effective Date&quot;. Continued interaction with the Portal constitutes acknowledgment of the revised Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="priv-sec-15" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              15. Data Protection Officer, Grievance Cell, and Contacts
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>15.1 Dedicated Redressal Officer:</strong> Students, parents, and authorized regulatory bodies may submit privacy inquiries, rectification petitions, or data governance representations directly to our designated authority:
              </p>
              
              <div className="my-4 p-5 rounded-xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs sm:text-sm space-y-1.5">
                <p className="font-bold text-white print:text-slate-900 mb-2">Data Protection &amp; Examination Privacy Contact Desk:</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Designated Official:</span> Registrar & Grievance Redressal Cell, NSIT Patna</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Supervisory Body:</span> Office of the Controller of Examinations, NSIT Patna</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Collegiate Institution:</span> Netaji Subhas Institute of Technology (NSIT)</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Postal Address:</span> Amhara, Bihta, Patna, Bihar - 801106, India</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Official Communication Email:</span> coe@nsit.ac.in</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Direct Telephone Desk:</span> +91 91024 03265</p>
              </div>

              <p>
                <strong>15.2 Resolution Timelines:</strong> Inquiries submitted to the Data Protection Officer will be logged with a unique tracking identifier and responded to within twenty-one (21) working days following institutional identity verification.
              </p>
              <p>
                <strong>15.3 Legal Jurisdiction:</strong> Any dispute, claim, litigation, or regulatory complaint arising from data processing under this Policy shall be subject exclusively to the territorial jurisdiction of the competent courts having jurisdiction over Amhara, Bihta, Patna, Bihar - 801106, India.
              </p>
            </div>
          </section>

        </div>

        {/* Formal Institutional Footer Sign-Off */}
        <footer className="mt-12 pt-8 border-t-2 border-slate-800 print:border-slate-300 text-center text-xs text-slate-400 print:text-slate-600">
          <p className="font-semibold text-slate-300 print:text-slate-800 mb-1">
            Approved by the Data Governance &amp; Examination Board &bull; Netaji Subhas Institute of Technology (NSIT)
          </p>
          <p className="mb-2">
            Reference: PRIV-PORTAL-A4/2026 &bull; Official Institutional Privacy Charter
          </p>
          <p className="text-[11px] text-slate-500">
            Confidential Academic Administration Notice &bull; Intended for Enrolled Candidates and Guardians
          </p>
        </footer>

      </div>
    </div>
  );
}
