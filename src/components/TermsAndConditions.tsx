import { useEffect } from 'react';
import { ArrowLeft, Printer, Shield, BookOpen, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';

interface LegalDocProps {
  onBack: () => void;
  onNavigateToPrivacy?: () => void;
}

export default function TermsAndConditions({ onBack, onNavigateToPrivacy }: LegalDocProps) {
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
          {onNavigateToPrivacy && (
            <button
              onClick={onNavigateToPrivacy}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer"
            >
              View Privacy Policy
            </button>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-md cursor-pointer"
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
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-4 print:hidden">
            <BookOpen className="w-8 h-8" />
          </div>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-sky-400 print:text-slate-600 mb-1">
            Official Institutional Document &bull; Examination Office Regulations
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white print:text-black mb-3">
            Terms and Conditions of Use
          </h1>
          <p className="text-base sm:text-lg text-slate-300 print:text-slate-700 font-medium max-w-3xl mx-auto">
            Governing Access, Roll-Number Credential Verification, and Provisional Semester Examination Disclosures for NSIT Semester Examination Result Portal
          </p>
          
          <div className="mt-6 pt-4 border-t border-slate-800/60 print:border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm text-left text-slate-400 print:text-slate-600">
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Institution:</span>
              <span>Netaji Subhas Institute of Technology (NSIT)</span>
            </div>
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Department:</span>
              <span>Office of the Controller of Examinations, NSIT Patna</span>
            </div>
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Effective Date:</span>
              <span>Academic Session 2025–2026 (Effective October 2026)</span>
            </div>
            <div className="bg-slate-950/50 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="block font-semibold text-slate-300 print:text-slate-800">Last Revised:</span>
              <span>October 2026 (Annual Review)</span>
            </div>
          </div>

          {/* Important Institutional Disclaimer Notice */}
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 print:bg-amber-50 print:border-amber-300 print:text-amber-900 text-xs sm:text-sm text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block mb-1">Institutional Status & Authentication Notice:</span>
              <span>
                Netaji Subhas Institute of Technology (NSIT) is an autonomous/affiliated educational institution operating NSIT Semester Examination Result Portal. This portal is an internal academic management system and does not claim to be a sovereign government authority or a state statutory body. In this software deployment, a student&apos;s allocated college roll number serves as the direct access identifier and password credential. Users are formally advised that roll numbers do not provide absolute cryptographic confidentiality against peers who possess knowledge of assigned institutional roll series.
              </span>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        <section className="mb-10 p-6 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:break-after-page">
          <h2 className="text-base sm:text-lg font-bold text-white print:text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-sky-400" />
            Table of Contents
          </h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-sky-400 print:text-sky-800">
            <a href="#sec-1" className="hover:underline flex items-center gap-1.5 py-1"><span>1.</span> Introduction and Acceptance of Terms</a>
            <a href="#sec-2" className="hover:underline flex items-center gap-1.5 py-1"><span>2.</span> Definitions and Statutory Interpretation</a>
            <a href="#sec-3" className="hover:underline flex items-center gap-1.5 py-1"><span>3.</span> Eligibility and Authorised Portal Usage</a>
            <a href="#sec-4" className="hover:underline flex items-center gap-1.5 py-1"><span>4.</span> Roll Number and Result-Access Architecture</a>
            <a href="#sec-5" className="hover:underline flex items-center gap-1.5 py-1"><span>5.</span> Obligations and Responsibilities of Students</a>
            <a href="#sec-6" className="hover:underline flex items-center gap-1.5 py-1"><span>6.</span> Marks, SGPA, CGPA, Credits & Progression Status</a>
            <a href="#sec-7" className="hover:underline flex items-center gap-1.5 py-1"><span>7.</span> Provisional Online Results vs Official Marksheets</a>
            <a href="#sec-8" className="hover:underline flex items-center gap-1.5 py-1"><span>8.</span> Result Scrutiny, Rechecking & Re-Evaluation</a>
            <a href="#sec-9" className="hover:underline flex items-center gap-1.5 py-1"><span>9.</span> Official Publication, Revisions & Gazettes</a>
            <a href="#sec-10" className="hover:underline flex items-center gap-1.5 py-1"><span>10.</span> Prohibited Activities, Forgery & Misuse</a>
            <a href="#sec-11" className="hover:underline flex items-center gap-1.5 py-1"><span>11.</span> Database Security & Technical Infrastructure</a>
            <a href="#sec-12" className="hover:underline flex items-center gap-1.5 py-1"><span>12.</span> Portal Availability, Maintenance & Errors</a>
            <a href="#sec-13" className="hover:underline flex items-center gap-1.5 py-1"><span>13.</span> Institutional Intellectual Property & Notices</a>
            <a href="#sec-14" className="hover:underline flex items-center gap-1.5 py-1"><span>14.</span> Disclaimers, Third-Party Links & Liabilities</a>
            <a href="#sec-15" className="hover:underline flex items-center gap-1.5 py-1"><span>15.</span> Grievances, Contacts, Amendments & Jurisdiction</a>
          </nav>
        </section>

        {/* Substantive Sections (1 through 15) */}
        <div className="space-y-10 text-slate-300 print:text-slate-800 text-sm sm:text-base leading-relaxed">

          {/* Section 1 */}
          <section id="sec-1" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              1. Introduction, Contractual Scope, and Acceptance of Terms
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>1.1 Regulatory Scope:</strong> These Terms and Conditions (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a formal, legally binding institutional agreement between <strong>Netaji Subhas Institute of Technology (NSIT)</strong> (hereinafter referred to as the &quot;Institution&quot;, &quot;College&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), having its administrative campus at <strong>Amhara, Bihta, Patna, Bihar - 801106, India</strong>, and any student, candidate, parent, faculty evaluator, or authorized visitor (hereinafter referred to as &quot;Student&quot;, &quot;User&quot;, or &quot;you&quot;) who accesses, queries, views, or interacts with the college examination portal known as <strong>NSIT Semester Examination Result Portal</strong> (&quot;Portal&quot;, &quot;Platform&quot;, or &quot;Service&quot;).
              </p>
              <p>
                <strong>1.2 Mandatory Acceptance:</strong> By accessing the Portal, entering an institutional roll number, clicking &quot;Search&quot;, downloading provisional grade cards, or utilizing administrative interfaces, you unequivocally confirm that you have read, understood, and agreed to be bound by every clause articulated within this document, alongside the associated <em>Institutional Privacy Policy</em> and the <em>Examination Conduct and Discipline Regulations</em> established by the <strong>Office of the Controller of Examinations, NSIT Patna</strong>.
              </p>
              <p>
                <strong>1.3 Rejection of Terms:</strong> If you do not accept these Terms in their entirety without reservation, you are not authorized to use this Portal and must immediately close your browser session and refrain from entering examination credentials.
              </p>
              <p>
                <strong>1.4 Non-Government Status:</strong> The Institution clarifies unequivocally that Netaji Subhas Institute of Technology (NSIT) is an independent educational institution and this Portal is an educational academic utility. Nothing contained herein shall be construed as creating, asserting, or implying any sovereign state authority, ministerial status, or government instrumentality, save for compliance with applicable educational statutes and laws in force.
              </p>
              <p>
                <strong>1.5 Interdependence with Academic Ordinances:</strong> These Terms operate in harmony with, and subject to, the Academic Regulations, Ordinances of Affiliation, Examination Codes, and Ordinances of the governing University and College Senate. In the event of an unavoidable contradiction between an automated electronic display on this Portal and the physically attested Academic Ledger signed by the Controller of Examinations, the physical Gazette and Academic Ledger shall prevail.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              2. Definitions, Interpretative Rules, and Academic Glossary
            </h3>
            <div className="space-y-3.5">
              <p>
                In the construction and interpretation of these Terms, unless the subject matter or context otherwise requires, the following terms shall have the respective meanings assigned to them:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>&quot;Academic Year&quot; / &quot;Semester&quot;:</strong> The designated academic term (e.g., Odd Semester, Even Semester, Supplementary Term) recognized by the college curriculum during which coursework, laboratories, and summative assessments occur.
                </li>
                <li>
                  <strong>&quot;College Roll Number&quot;:</strong> The unique alphanumeric sequence officially assigned to a matriculated candidate upon admission by Netaji Subhas Institute of Technology (NSIT) (such as serial formats <code>89251001</code>, <code>89251002</code>, or departmental indices) representing the student&apos;s master academic ledger identity.
                </li>
                <li>
                  <strong>&quot;Access Key / Credential&quot;:</strong> In the current software version of NSIT Semester Examination Result Portal, the candidate&apos;s allocated roll number operates concurrently as the search query key and the default view authorization key.
                </li>
                <li>
                  <strong>&quot;Provisional Result&quot;:</strong> An interim, preliminary electronic display of examination performance, marks, letter grades, credit points, and clear status, published prior to formal convocation or the physical issuance of embossed, tamper-evident Grade Cards.
                </li>
                <li>
                  <strong>&quot;SGPA&quot; &amp; &quot;CGPA&quot;:</strong> Semester Grade Point Average and Cumulative Grade Point Average calculated in accordance with institutional grading conventions (e.g., 10-point scale or percentage conversions as authorized by the Academic Council).
                </li>
                <li>
                  <strong>&quot;Carry Subjects / Backlog&quot;:</strong> Course modules, theory papers, or practical components in which a candidate has not attained the minimum prescribed threshold score and is consequently mandated to re-appear in subsequent examination cycles.
                </li>
                <li>
                  <strong>&quot;Clear Status&quot;:</strong> The administrative determination indicating whether a student has satisfied all module-level and aggregate criteria for the designated semester (denoted as &quot;Cleared&quot;, &quot;Carry&quot;, &quot;Withheld&quot;, or &quot;Incomplete&quot;).
                </li>
                <li>
                  <strong>&quot;Malpractice / UFM&quot;:</strong> Unfair Means as defined under the College Examination Discipline Bye-Laws, including unauthorized impersonation, system penetration, record fabrication, or tampering with database entries.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              3. Eligibility, Matriculation Status, and Authorised Use
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>3.1 Authorised Users:</strong> Access to NSIT Semester Examination Result Portal is restricted strictly to currently matriculated or formally graduated alumni candidates of Netaji Subhas Institute of Technology (NSIT), their verified parents or legal guardians acting with the student&apos;s express consent, and accredited examination officers, registrars, and faculty evaluators possessing authorized administrative credentials.
              </p>
              <p>
                <strong>3.2 Verification of Enrolment:</strong> A student is entitled to query results only for those examination cycles for which they have duly registered, remitted required institutional examination fees, fulfilled attendance criteria as prescribed by collegiate ordinances, and been formally issued an Examination Admit Card.
              </p>
              <p>
                <strong>3.3 Debarred or Withheld Candidates:</strong> Candidates whose results have been formally withheld by the Office of the Controller of Examinations, NSIT Patna due to disciplinary inquiries, attendance deficiencies, library dues, laboratory clearances, or ongoing Malpractice Committee proceedings shall see their status designated as &quot;Withheld&quot; or &quot;Incomplete&quot;. Such candidates are strictly forbidden from attempting to circumvent status flags or requesting unofficial grade attestations.
              </p>
              <p>
                <strong>3.4 Non-Transferability:</strong> The right to access academic records through this Portal is personal, non-transferable, and non-assignable. No candidate shall lease, publish, or delegate access keys to commercial tutoring agencies, automated aggregator scrapers, or third-party web services.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              4. Student Roll Number and Result-Access Architecture
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>4.1 Transparent Mechanism Disclosure:</strong> The technical architecture of NSIT Semester Examination Result Portal utilizes the student&apos;s designated College Roll Number (e.g., <code>89251001</code>) as both the public record retrieval index and the authorization access key.
              </p>
              <p>
                <strong>4.2 Absence of Cryptographic Confidentiality:</strong> Users must acknowledge that institutional roll numbers are generally sequenced in incremental, predictable series across batches, departments, and class registers. Consequently:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Knowledge of a classmate&apos;s roll number could technically allow a party to enter that credential and inspect provisional semester grades.
                </li>
                <li>
                  The Institution explicitly disclaims that a standalone roll number constitutes a high-assurance, zero-knowledge, or multi-factor cryptographic password.
                </li>
                <li>
                  The Portal does not collect biometric secrets, government identity cards, or banking passwords from students for simple result lookup.
                </li>
              </ul>
              <p>
                <strong>4.3 Institutional Recommendation for Enhanced Security:</strong> In accordance with progressive educational security standards, Netaji Subhas Institute of Technology (NSIT) strongly advises and plans the incremental rollout of supplementary verification mechanisms, including student-configured secret Personal Identification Numbers (PINs), institutional email-based One-Time Passwords (OTPs), and multi-factor authenticators. Where administrative features permit custom student access passwords, candidates and administrators must set robust, unique alphanumeric passcodes and refrain from sharing them.
              </p>
              <p>
                <strong>4.4 Candidate Duty of Confidentiality:</strong> Even under a roll-number-based scheme, students bear an affirmative ethical and institutional obligation not to intentionally scrape, guess, brute-force, or browse the examination ledgers of their peers without explicit written authorization.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              5. Responsibilities, Obligations, and Ethical Conduct of Portal Users
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>5.1 Accuracy of Submitted Input:</strong> Every user attempting to view or query records warrants that the roll number and any accompanying verification inputs submitted correspond faithfully to their own authorized person or legitimate dependent.
              </p>
              <p>
                <strong>5.2 Prohibition of Impersonation:</strong> Falsely entering another candidate&apos;s roll number with malicious intent, snooping into peer marks for harassment, publishing peer grades on social networks or public message boards, or misrepresenting oneself as an examination officer or college administrator constitutes an actionable infraction under both collegiate disciplinary codes and applicable computer misuse statutes.
              </p>
              <p>
                <strong>5.3 Prompt Scrutiny of Records:</strong> Upon obtaining an electronic result display, the student is obligated to immediately review all entered data elements, including candidate full name, father&apos;s/mother&apos;s name, module codes, awarded marks, credits earned, and progression status. Any discrepancies must be reported to the Office of the Controller of Examinations, NSIT Patna within the designated statutory grievance window.
              </p>
              <p>
                <strong>5.4 Safe Storage of Downloaded Grade Cards:</strong> When students download or print electronic grade transcripts or PDF marksheets from the Portal, they assume sole custody of such printed or cached files. The Institution cannot be held liable for disclosures resulting from unattended personal devices, shared campus terminals, or public cyber-cafes.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="sec-6" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              6. Semester Results, Marks, Grades, Credits, and Academic Progression
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>6.1 Computation Guidelines:</strong> SGPA and CGPA displayed on the Portal are calculated utilizing the approved institutional credit grading framework:
              </p>
              <div className="bg-slate-950/60 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 font-mono text-xs sm:text-sm">
                SGPA = &Sigma; (Course Credits &times; Grade Points Earned) / &Sigma; (Total Semester Registered Credits)
              </div>
              <p>
                <strong>6.2 Carry Subjects and Backlogs:</strong> If a candidate fails to achieve the minimum qualifying passing grade in any theory paper, laboratory practical, internal continuous assessment, or viva voce, the system flags the respective course under &quot;Carry Subjects&quot;. The overall status will indicate &quot;Carry&quot; rather than &quot;Cleared&quot;.
              </p>
              <p>
                <strong>6.3 Technical Glitch Non-Failure Principle:</strong> In the event that a student&apos;s online entry shows zero marks, an omitted subject code, or an unexpected blank field due to database synchronization, transmission timeout, or formatting error, <strong>such omission must not automatically be interpreted as an academic failure or debarment</strong>. The student is advised to remain calm and submit a formal verification requisition to the Office of the Controller of Examinations, NSIT Patna accompanied by their admit card.
              </p>
              <p>
                <strong>6.4 Academic Progression Criteria:</strong> Promotion to subsequent academic years or semesters remains subject to the institutional ordinances governing minimum cumulative credits and maximum permissible backlogs. The electronic display of an SGPA does not by itself confer automatic eligibility for enrollment into future semesters if prerequisite criteria remain unfulfilled.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="sec-7" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              7. Provisional Online Results vs. Formal Attested Marksheets
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>7.1 Strictly Provisional Character:</strong> The marks, credits, and status published on NSIT Semester Examination Result Portal are strictly provisional and intended for immediate informational guidance of candidates.
              </p>
              <p>
                <strong>7.2 Non-Equivalence to Physical Transcripts:</strong> Unless expressly recognized by a receiving government agency, university, or statutory council under a signed electronic verification scheme, the web-rendered grade slip or browser printout does not constitute an original, sealed, tamper-evident Marks Ledger or Migration Certificate.
              </p>
              <p>
                <strong>7.3 Absolute Prohibition of Forgery:</strong> Any alteration, digital editing, photo-manipulation, injection of fabricated SGPA numbers into HTML DOM trees, falsification of browser screenshots, or physical reproduction of forged grade documents is a criminal offense of document forgery and a catastrophic violation of collegiate ethics. The Institution prosecutes document tampering to the fullest extent of the law and initiates immediate expulsion and blacklisting.
              </p>
              <p>
                <strong>7.4 Issuance of Final Transcripts:</strong> Original, embossed, holographic grade sheets bearing the signature of the Controller of Examinations and seal of Netaji Subhas Institute of Technology (NSIT) must be formally collected from the administrative office in accordance with the institutional calendar.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="sec-8" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              8. Result Corrections, Scrutiny, Rechecking, and Re-Evaluation
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>8.1 Right to Seek Re-Evaluation:</strong> Any bona fide student who considers that their summative evaluation reflects an arithmetic discrepancy, unassessed answer scripts, or incorrect tabulation is entitled to petition for scrutiny or re-evaluation under the Examination Bye-Laws.
              </p>
              <p>
                <strong>8.2 Strict Deadlines:</strong> Scrutiny applications must be submitted within the statutory window—ordinarily within fifteen (15) calendar days from the date of initial publication on this Portal. Petitions submitted after the deadline will be rejected summarily without recourse.
              </p>
              <p>
                <strong>8.3 Prescribed Procedure:</strong> Applications must be submitted through the prescribed physical or electronic form, accompanied by the requisite non-refundable scrutiny fee established by the Finance Committee of Netaji Subhas Institute of Technology (NSIT).
              </p>
              <p>
                <strong>8.4 Outcome and Ledger Overwrite:</strong> During re-evaluation, marks may increase, remain unchanged, or decrease based on the independent assessment of the board of senior examiners. The revised score decided by the competent board shall become final, superseding any prior provisional figure displayed on the Portal.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="sec-9" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              9. Result Publication, Gazette Revisions, and Administrative Updates
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>9.1 Phased Publication:</strong> Results are uploaded to the Portal in planned tranches following moderation by the departmental Board of Studies and final clearance by the Examination Council. Notification of publication will be made available via official campus noticeboards and institutional channels.
              </p>
              <p>
                <strong>9.2 Institution&apos;s Inherent Right to Rectify:</strong> The Office of the Controller of Examinations, NSIT Patna retains the inherent, unfettered right to rectify clerical blunders, typographical errors, system data-entry slips, or omitted moderator adjustments at any time. The publication of an erratum or amended digital entry on this Portal shall take immediate effect.
              </p>
              <p>
                <strong>9.3 Non-Vesting of Erroneous Benefit:</strong> No student may claim a vested legal right, degree conferral, or academic exemption solely derived from an inadvertent clerical error that is visibly at odds with actual examination records, marked answer booklets, or Board of Examiners gazettes.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="sec-10" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              10. Prohibited Activities, Fraudulent Misuse, and Security Violations
            </h3>
            <div className="space-y-3.5">
              <p>
                Users of the Portal are strictly prohibited from engaging in any of the following unauthorized, illegal, or unethical actions:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Automated Scraping and Crawling:</strong> Deploying bots, spiders, automated Python scripts, cURL loops, or headless browsers to scrape mass student records or enumerate roll number series (e.g., sequentially pinging <code>89251001</code> to <code>89251999</code>).
                </li>
                <li>
                  <strong>Denial of Service Attacks:</strong> Flooding the web application server, Firestore database, or API endpoints with excessive queries, causing latency or service denial for bona fide candidates.
                </li>
                <li>
                  <strong>Credential Circumvention:</strong> Attempting to break, crack, or bypass administrator authentication modal controls, PIN entry systems, or backend rules protecting records.
                </li>
                <li>
                  <strong>Injection and Tampering:</strong> Executing Cross-Site Scripting (XSS), Structured Query Injection, NoSQL payload injections, or DOM tampering to spoof marks.
                </li>
                <li>
                  <strong>Fabrication of Official Endorsements:</strong> Using institutional crests, watermarks, or typography to generate forged academic credentials for employment, visa processing, or higher education admissions.
                </li>
              </ol>
              <p>
                <strong>10.2 Penalties and Disciplinary Recourse:</strong> Violations of this Section will result in immediate termination of portal privileges, reporting to the Proctorial Board, filing of formal police complaints under Information Technology acts, suspension or expulsion from Netaji Subhas Institute of Technology (NSIT), and revocation of earned degrees.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="sec-11" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              11. Technical Infrastructure, Database Security, and Safeguards
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>11.1 Infrastructure Deployment:</strong> NSIT Semester Examination Result Portal leverages modern web application frameworks and cloud datastore infrastructure (such as Google Cloud / Firebase Firestore) to store, retrieve, and present academic records.
              </p>
              <p>
                <strong>11.2 Reasonable Security Safeguards:</strong> The Institution applies standard security safeguards, including TLS/HTTPS transport layer encryption in transit, managed firewalls, and programmatic security rules designed to prevent unauthenticated write or delete mutations on student databases.
              </p>
              <p>
                <strong>11.3 No Absolute Warranty:</strong> While the College implements all reasonable and standard technical safeguards, users acknowledge that no software system connected to the public internet can be warranted as 100% immune from sophisticated cyber assaults, zero-day vulnerabilities, or distributed attacks. The College commits to diligent patch management and swift remediation upon discovering any vulnerability.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="sec-12" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              12. Service Availability, Maintenance, Latency, and Outages
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>12.1 Operational Uptime:</strong> The Institution strives to ensure continuous availability of the Portal, particularly during peak examination result declaration cycles. However, the Portal is provided on an &quot;AS AVAILABLE&quot; basis.
              </p>
              <p>
                <strong>12.2 Scheduled and Emergency Downtime:</strong> The College reserves the right to suspend or limit access to the Portal without prior notification for server upgrades, database indexing, critical security patches, or emergency infrastructure maintenance.
              </p>
              <p>
                <strong>12.3 Network Latency and Peak Traffic:</strong> During initial declaration hours, concurrent access by thousands of students may cause temporary bandwidth throttling, queue delays, or slow responses. Users are advised to avoid continuous browser refreshes and to re-attempt lookup after a reasonable interval.
              </p>
              <p>
                <strong>12.4 Limitation on Consequential Damages:</strong> To the maximum extent permitted by governing law, Netaji Subhas Institute of Technology (NSIT) shall not be held liable for any missed application deadlines, job interview postponements, emotional distress, or indirect economic damages resulting from transient portal downtime or delayed result lookups.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="sec-13" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              13. Intellectual Property, Institutional Crests, and Permitted Use
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>13.1 Institutional Property:</strong> All names, crests, collegiate seals, logos, domain names, UI designs, graphics, and compilation layouts used within NSIT Semester Examination Result Portal are the exclusive intellectual property of Netaji Subhas Institute of Technology (NSIT) or its licensors.
              </p>
              <p>
                <strong>13.2 Permitted Personal Archival:</strong> Enrolled candidates are granted a limited, revocable, non-exclusive license to view, display, and generate one (1) physical or digital copy of their personal provisional grade report solely for legitimate personal records, academic counseling, or provisional admission requirements.
              </p>
              <p>
                <strong>13.3 Commercial Prohibitions:</strong> No part of the Portal, its underlying code, marksheet design, or compiled databases may be reproduced, sold, licensed, mirrored, framed, or incorporated into commercial result aggregator services without prior written authorization from the Registrar of Netaji Subhas Institute of Technology (NSIT).
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="sec-14" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              14. External Links, Disclaimers, and Statutory Rights Preservation
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>14.1 External References:</strong> The Portal may occasionally provide informational links to external university portals, scholarship boards, government educational frameworks, or evaluation centers. Netaji Subhas Institute of Technology (NSIT) exerts no control over third-party servers and accepts no responsibility for their content, uptime, or privacy practices.
              </p>
              <p>
                <strong>14.2 Statutory Consumer and Student Rights:</strong> Nothing in these Terms shall operate to exclude, restrict, or modify any statutory student rights, educational consumer protections, or legal guarantees that cannot be lawfully limited or excluded under the applicable national and regional laws of the jurisdiction in which the College is situated.
              </p>
              <p>
                <strong>14.3 Non-Waiver:</strong> Failure by the College to enforce any provision or condition of these Terms at any specific juncture shall not be construed as a general waiver of the Institution&apos;s right to enforce such provision at any subsequent time.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="sec-15" className="border-t border-slate-800/80 pt-8 print:border-slate-300 print:pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-3">
              15. Complaints, Grievance Handling, Amendments, and Governing Law
            </h3>
            <div className="space-y-3.5">
              <p>
                <strong>15.1 Academic Grievance Cell:</strong> Students with grievances regarding examination marks, computational anomalies, or portal access barriers must register a written representation addressed to the Grievance Redressal Committee or Examination Office.
              </p>
              
              <div className="my-4 p-5 rounded-xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs sm:text-sm space-y-1.5">
                <p className="font-bold text-white print:text-slate-900 mb-2">Institutional Contact Matrix:</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Competent Authority:</span> Controller of Examinations / Registrar</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Official Campus Address:</span> Amhara, Bihta, Patna, Bihar - 801106, India</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Official Electronic Mail:</span> coe@nsit.ac.in</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Helpdesk Telephone:</span> +91 91024 03265</p>
                <p><span className="font-semibold text-slate-300 print:text-slate-700">Departmental Office:</span> Office of the Controller of Examinations, NSIT Patna</p>
              </div>

              <p>
                <strong>15.2 Timelines for Redressal:</strong> All formal written grievances received by the Office of the Controller of Examinations, NSIT Patna will be recorded in the institutional grievance register and processed within thirty (30) business days following verification against the physical ledger.
              </p>
              <p>
                <strong>15.3 Right of Amendment:</strong> The Institution reserves the right to modify, amend, update, or revise these Terms and Conditions at its sole discretion to accommodate evolving academic regulations, technological upgrades, or statutory mandates. Revisions will be uploaded directly to this Portal with a revised &quot;Last Revised&quot; date. Continued access of the Portal after such posting constitutes acceptance of the amended terms.
              </p>
              <p>
                <strong>15.4 Severability:</strong> If any provision, clause, or paragraph of these Terms is deemed invalid, unlawful, or unenforceable by an authoritative tribunal or competent court of jurisdiction, such determination shall not impair the validity and enforceability of the remaining provisions, which shall continue in full legal force and effect.
              </p>
              <p>
                <strong>15.5 Governing Law and Sole Jurisdiction:</strong> These Terms and Conditions shall be governed by, construed, and enforced in accordance with the substantive laws and educational codes of the jurisdiction where Netaji Subhas Institute of Technology (NSIT) is domiciled. Any dispute, claim, litigation, or legal proceeding arising out of or in connection with this Portal shall fall under the exclusive jurisdiction of the competent civil courts situated within the district of the College&apos;s administrative headquarters.
              </p>
            </div>
          </section>

        </div>

        {/* Formal Institutional Footer Sign-Off */}
        <footer className="mt-12 pt-8 border-t-2 border-slate-800 print:border-slate-300 text-center text-xs text-slate-400 print:text-slate-600">
          <p className="font-semibold text-slate-300 print:text-slate-800 mb-1">
            Issued by Order of the Controller of Examinations &bull; Netaji Subhas Institute of Technology (NSIT)
          </p>
          <p className="mb-2">
            Document Reference: COE-TOS-REV2026/A4 &bull; Preserved in Institutional Archives
          </p>
          <p className="text-[11px] text-slate-500">
            For personal student informational guidance only. Official sealed transcripts must be collected from the Office of the Controller of Examinations, NSIT Patna.
          </p>
        </footer>

      </div>
    </div>
  );
}
