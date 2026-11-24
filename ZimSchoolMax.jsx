import React, { useMemo, useState, useEffect } from "react";
import "./ZimSchoolMax.css";

const subjects = [
  ["Combined Science", "4003", "Science", ["Food tests", "Electricity", "Cells", "Forces", "Acids and bases"]],
  ["Mathematics", "4008", "Mathematics", ["Number", "Algebra", "Geometry", "Statistics", "Graphs"]],
  ["English Language", "1122", "Languages", ["Comprehension", "Summary", "Composition", "Grammar"]],
  ["Heritage Studies", "1157", "Humanities", ["Identity", "Culture", "National history", "Heritage conservation"]],
  ["Geography", "2248", "Humanities", ["Weather", "Map work", "Population", "Natural resources"]],
  ["History", "2167", "Humanities", ["Sources", "Colonialism", "Nationalism", "Independence"]],
  ["Principles of Accounting", "7112", "Commerce", ["Accounting equation", "Ledger", "Trial balance", "Final accounts"]],
  ["A-Level Sciences", "Advanced", "Sciences", ["Biology", "Chemistry", "Physics", "Practical skills"]],
];

const practicals = [
  "Food tests on solution A", "Heating and cooling curves", "Electrical circuits and resistance",
  "Density of a regular or irregular object", "Force and extension of a spring",
  "Investigating a simple pendulum", "Acids, alkalis and indicators",
  "Separating mixtures by filtration", "Microscope observation and biological drawing",
  "Investigating factors affecting evaporation",
];

const bank = [
  {id:1, subject:"Combined Science", topic:"Food tests", q:"Which reagent is used to test for starch?", options:["Benedict’s solution","Iodine solution","Biuret solution","Ethanol"], answer:1, why:"Iodine turns blue-black when starch is present."},
  {id:2, subject:"Mathematics", topic:"Algebra", q:"Solve 3x − 7 = 11.", options:["x = 4","x = 6","x = 8","x = 18"], answer:1, why:"Add 7 to get 3x = 18, then divide by 3."},
  {id:3, subject:"Principles of Accounting", topic:"Accounting equation", q:"Assets are $800 and liabilities are $275. What is capital?", options:["$1,075","$525","$275","$800"], answer:1, why:"Capital = assets − liabilities = $525."},
  {id:4, subject:"Geography", topic:"Map work", q:"A map scale of 1:50,000 means 1 cm represents…", options:["50 m","500 m","5 km","50 km"], answer:1, why:"50,000 cm = 500 m."},
  {id:5, subject:"English Language", topic:"Grammar", q:"Which sentence uses the apostrophe correctly?", options:["The students book’s are here.","The student's books are here.","The students' book's are here."], answer:1, why:"The apostrophe in student's shows possession by one student."},
];

const initialMastery = Object.fromEntries(subjects.map(([name]) => [name, {}]));
const getStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };

export default function ZimSchoolMax() {
  const [role,setRole] = useState("Student");
  const [page,setPage] = useState("Home");
  const [query,setQuery] = useState("");
  const [goal,setGoal] = useState(60);
  const [streak,setStreak] = useState(()=>getStore("zsm-streak",1));
  const [mastery,setMastery] = useState(()=>getStore("zsm-mastery",initialMastery));
  const [mistakes,setMistakes] = useState(()=>getStore("zsm-mistakes",[]));
  const [saved,setSaved] = useState(()=>getStore("zsm-saved",[]));
  const [flashIndex,setFlashIndex] = useState(0);
  const [flashBack,setFlashBack] = useState(false);
  const [selectedSubject,setSelectedSubject] = useState(subjects[0][0]);
  const [selectedPractical,setSelectedPractical] = useState(practicals[0]);
  const [labStep,setLabStep] = useState(0);
  const [sample,setSample] = useState("Both nutrients");
  const [report,setReport] = useState("");
  const [quizIndex,setQuizIndex] = useState(0);
  const [quizChoice,setQuizChoice] = useState(null);
  const [quizFeedback,setQuizFeedback] = useState("");
  const [markText,setMarkText] = useState("");
  const [markResult,setMarkResult] = useState(null);
  const [tutorPrompt,setTutorPrompt] = useState("");
  const [tutorMessages,setTutorMessages] = useState([]);
  const [examStarted,setExamStarted] = useState(false);
  const [examMinutes,setExamMinutes] = useState(20);
  const [examScore,setExamScore] = useState(null);
  const [modal,setModal] = useState("");
  const [notice,setNotice] = useState("");
  const [goalDone,setGoalDone] = useState(0);

  useEffect(()=>localStorage.setItem("zsm-streak",JSON.stringify(streak)),[streak]);
  useEffect(()=>localStorage.setItem("zsm-mastery",JSON.stringify(mastery)),[mastery]);
  useEffect(()=>localStorage.setItem("zsm-mistakes",JSON.stringify(mistakes)),[mistakes]);
  useEffect(()=>localStorage.setItem("zsm-saved",JSON.stringify(saved)),[saved]);

  const flashcards = [
    ["What colour indicates starch in the iodine test?","Blue-black."],
    ["What does Benedict’s test detect?","Reducing sugars, after heating."],
    ["State the accounting equation.","Assets = Capital + Liabilities."],
    ["What is the formula for density?","Density = mass ÷ volume."],
    ["What is a map scale?","The relationship between map distance and ground distance."],
  ];
  const searchResults = useMemo(()=>{
    if(!query.trim()) return [];
    const q=query.toLowerCase();
    return [
      ...subjects.filter(s=>s[0].toLowerCase().includes(q)||s[3].some(t=>t.toLowerCase().includes(q))).map(s=>({type:"Subject",title:s[0],detail:s[3].join(" • "),page:"Study Hub"})),
      ...bank.filter(b=>(b.q+b.topic+b.subject).toLowerCase().includes(q)).map(b=>({type:"Question",title:b.q,detail:b.subject+" · "+b.topic,page:"Practice"})),
      ...practicals.filter(p=>p.toLowerCase().includes(q)).map(p=>({type:"Practical",title:p,detail:"Virtual practical room",page:"Practical Room"})),
      ...flashcards.filter(f=>f.join(" ").toLowerCase().includes(q)).map(f=>({type:"Flashcard",title:f[0],detail:f[1],page:"Study Hub"})),
    ];
  },[query]);

  const go = p => {setPage(p);setNotice("");};
  const updateMastery = (subject,topic,value) => setMastery(prev=>({...prev,[subject]:{...(prev[subject]||{}),[topic]:value}}));
  const toggleSaved = item => setSaved(prev=>prev.includes(item)?prev.filter(x=>x!==item):[...prev,item]);
  const currentQuestion = bank[quizIndex % bank.length];
  const askTutor = () => {
    if(!tutorPrompt.trim()) return;
    const answer = /food|iodine|benedict/i.test(tutorPrompt)
      ? "Step 1: Add iodine solution to the sample. A blue-black colour shows starch. Step 2: Add Benedict’s solution to a fresh sample and heat it in a hot-water bath. A green, yellow, orange or brick-red change indicates reducing sugar. Record the observation, then state the conclusion."
      : /equation|solve|algebra/i.test(tutorPrompt)
      ? "Let's work step by step: identify the unknown, collect like terms, perform the same operation on both sides, and check your answer by substitution. Share the exact equation and I can show each calculation."
      : "Start by identifying the command word and the key concept. Write a short definition or relevant formula, apply it to the question, show your working, and finish with a clear conclusion. This is the built-in guided tutor; connect a secure AI service for live model responses.";
    setTutorMessages(prev=>[...prev,{q:tutorPrompt,a:answer}]); setTutorPrompt("");
  };
  const markAnswer = () => {
    const words = markText.toLowerCase().match(/[a-z0-9]+/g)||[];
    const key = ["iodine","blue-black","starch","benedict","reducing","sugar","heated"];
    const found = [...new Set(key.filter(k=>words.join(" ").includes(k)))];
    const score = Math.min(5,found.length);
    setMarkResult({score,found,model:"Add iodine solution to a sample. A blue-black colour indicates starch. Add Benedict’s solution to a fresh sample and heat in a water bath. A green, yellow, orange or brick-red precipitate indicates reducing sugar."});
    if(score<4) setMistakes(prev=>[...new Set([...prev,"Combined Science: food-test explanation"])]);
  };
  const answerQuiz = i => {
    setQuizChoice(i);
    if(i===currentQuestion.answer) setQuizFeedback("Correct — "+currentQuestion.why);
    else {setQuizFeedback("Not quite. "+currentQuestion.why);setMistakes(prev=>[...new Set([...prev,currentQuestion.subject+": "+currentQuestion.topic])]);}
  };
  const buildReport = () => setReport(`Practical: ${selectedPractical}\nSample: ${sample}\nObservation: ${labStep>=1?"Test result observed in simulation.":"Not yet recorded."}\nConclusion: ${labStep>=2?"Conclusion recorded from the selected sample.":"Complete the simulation and enter a conclusion."}\nPrecautions: Wear eye protection; follow teacher instructions; use safe equipment.`);
  const navItems=["Home","Study Hub","Practice","Practical Room","AI Tutor","Exam Simulations","Classrooms","Tutor Directory"];

  return <div className="zsm">
    <aside className="zsm-sidebar">
      <div className="zsm-logo">ZimSchool <b>Max</b><small>Heritage-based learning</small><span className="zsm-creator-tag">Created by Terry Sheldon</span></div>
      <div className="zsm-role"><label>Workspace role</label><select value={role} onChange={e=>setRole(e.target.value)}>{["Student","Parent","Teacher-Admin"].map(r=><option key={r}>{r}</option>)}</select></div>
      <nav>{navItems.map(n=><button key={n} className={page===n?"active":""} onClick={()=>go(n)}>{n}</button>)}</nav>
      <div className="zsm-sidebar-foot">O & A-Level • ZIMSEC<br/><small>Learning, practice and progress</small></div>
    </aside>
    <main className="zsm-main">
      <header className="zsm-topbar"><div><span className="zsm-eyebrow">{role} workspace</span><h1>{page}</h1></div><div className="zsm-top-actions"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search notes, questions, practicals…"/><button className="zsm-quiet" onClick={()=>setModal("notifications")}>♧ Notifications</button><button className="zsm-quiet" onClick={()=>setModal("report")}>Report issue</button></div></header>
      {query && <div className="zsm-search-results"><b>Search results</b>{searchResults.length?searchResults.map((r,i)=><button key={i} onClick={()=>{go(r.page);setQuery("");}}><span>{r.type}</span><strong>{r.title}</strong><small>{r.detail}</small></button>):<p>No matches yet. Try a subject or topic.</p>}</div>}
      {notice && <div className="zsm-notice">{notice}</div>}

      {page==="Home" && <section>
        <div className="zsm-welcome"><div><span className="zsm-chip">Your learning dashboard</span><h2>Small steps. Strong results.</h2><p>Plan your study time, practise consistently and keep track of what you master.</p><button onClick={()=>go("Study Hub")}>Continue learning →</button></div><div className="zsm-welcome-stat"><strong>{streak}</strong><span>day study streak</span><button className="zsm-outline" onClick={()=>{setStreak(s=>s+1);setGoalDone(d=>Math.min(goal,d+10));setNotice("Study session recorded on this device.")}}>Log a study session</button></div></div>
        <div className="zsm-stats"><Stat title="Daily goal" value={`${goalDone}/${goal} min`} detail="Set a target below"/><Stat title="Topics mastered" value={Object.values(mastery).flatMap(x=>Object.values(x)).filter(Boolean).length} detail="Across your subjects"/><Stat title="Mistake notebook" value={mistakes.length} detail="Topics to revisit"/><Stat title="Saved revision" value={saved.length} detail="Bookmarks and flashcards"/></div>
        <div className="zsm-grid two"><Panel title="Daily study goal"><label>Minutes per day</label><input type="number" min="10" max="360" value={goal} onChange={e=>setGoal(Math.max(10,+e.target.value||10))}/><div className="zsm-progress"><span style={{width:`${Math.min(100,goalDone/goal*100)}%`}}/></div><p>{Math.max(0,goal-goalDone)} minutes left in today's goal</p><button className="zsm-secondary" onClick={()=>setGoalDone(0)}>Reset today</button></Panel><Panel title="Timetable snapshot"><p><b>Today’s suggested plan</b></p><ul><li>15 min — flashcard review</li><li>25 min — one difficult topic</li><li>20 min — timed practice</li></ul><button className="zsm-secondary" onClick={()=>setModal("timetable")}>Customize timetable</button></Panel><Panel title="Live lesson alert"><span className="zsm-chip">Classroom preview</span><p>No live lesson is scheduled in this demo workspace.</p><button className="zsm-secondary" onClick={()=>go("Classrooms")}>Open classrooms</button></Panel><Panel title="Quick launch"><div className="zsm-quick"><button onClick={()=>go("Practical Room")}>🧪 Virtual practical</button><button onClick={()=>go("Practice")}>✍ Practice questions</button><button onClick={()=>go("AI Tutor")}>💬 Ask tutor</button><button onClick={()=>go("Exam Simulations")}>⏱ Exam simulation</button></div></Panel></div>
        <p className="zsm-integrity">Academic integrity: use AI feedback to learn and improve. Submit your own work, cite sources when required, and follow your school’s rules.</p>
      </section>}

      {page==="Study Hub" && <section><div className="zsm-section-intro"><h2>Study Hub</h2><p>Eight subject pathways, mastery tracking, flashcards and a personal study plan.</p></div><div className="zsm-subject-grid">{subjects.map(([name,code,group,topics])=><article className="zsm-subject" key={name}><span className="zsm-chip">{group} · {code}</span><h3>{name}</h3><p>{topics.length} topic groups · track your progress</p>{topics.map(t=><label className="zsm-topic" key={t}><input type="checkbox" checked={!!mastery[name]?.[t]} onChange={e=>updateMastery(name,t,e.target.checked)}/>{t}</label>)}<button className="zsm-secondary" onClick={()=>{setSelectedSubject(name);setNotice(`${name} selected for your study plan.`)}}>Add to study plan</button></article>)}</div><div className="zsm-grid two"><Panel title="3D-flip flashcards"><div className="zsm-flash" onClick={()=>setFlashBack(!flashBack)} role="button" tabIndex="0" onKeyDown={e=>e.key==="Enter"&&setFlashBack(!flashBack)}><span>{flashBack?"ANSWER":"TAP TO FLIP"}</span><strong>{flashcards[flashIndex][flashBack?1:0]}</strong></div><div className="zsm-inline"><button className="zsm-secondary" onClick={()=>{setFlashIndex(i=>(i+flashcards.length-1)%flashcards.length);setFlashBack(false)}}>← Previous</button><button className="zsm-secondary" onClick={()=>{setFlashIndex(i=>(i+1)%flashcards.length);setFlashBack(false)}}>Next →</button><button className="zsm-secondary" onClick={()=>toggleSaved(flashcards[flashIndex][0])}>{saved.includes(flashcards[flashIndex][0])?"★ Saved":"☆ Save"}</button></div></Panel><Panel title="Personal study plan generator"><p>Selected focus: <b>{selectedSubject}</b></p><label>Available study time (minutes)</label><input id="plan-minutes" type="number" defaultValue="60"/><button onClick={()=>{const m=Math.max(15,Number(document.getElementById("plan-minutes").value)||60);setNotice(`Suggested plan: ${Math.round(m*.5)} min ${selectedSubject} topic study, ${Math.round(m*.3)} min questions, ${Math.round(m*.2)} min review.`)}}>Generate plan</button></Panel></div></section>}

      {page==="Practice" && <section><div className="zsm-section-intro"><h2>Practise & AI Marking</h2><p>Filter questions, receive keyword feedback and keep a mistake notebook.</p></div><div className="zsm-grid two"><Panel title="Question bank"><label>Filter by subject</label><select id="bank-filter"><option>All subjects</option>{subjects.map(s=><option key={s[0]}>{s[0]}</option>)}</select>{bank.filter(q=>document.getElementById("bank-filter")?.value==="All subjects"||!document.getElementById("bank-filter")||q.subject===document.getElementById("bank-filter").value).map(q=><div className="zsm-question" key={q.id}><span className="zsm-chip">{q.subject} · {q.topic}</span><p><b>{q.q}</b></p>{q.options.map((o,i)=><button key={i} className="zsm-option" onClick={()=>{setQuizIndex(bank.indexOf(q));setQuizChoice(i);setQuizFeedback(i===q.answer?"Correct — "+q.why:"Review: "+q.why)}}>{String.fromCharCode(65+i)}. {o}</button>)}{quizIndex===bank.indexOf(q)&&quizFeedback&&<p className="zsm-feedback">{quizFeedback}</p>}</div>)}</Panel><Panel title="Paper 2 AI marking assistant"><p>Enter your response to a practice prompt. Feedback is a learning aid, not an official mark.</p><div className="zsm-prompt">Prompt: Describe food tests for starch and reducing sugar, including observations.</div><textarea rows="5" value={markText} onChange={e=>setMarkText(e.target.value)} placeholder="Write your answer here…"/><button onClick={markAnswer}>Check keywords</button>{markResult&&<div className="zsm-feedback"><b>Indicative keyword coverage: {markResult.score}/5</b><p>Detected: {markResult.found.join(", ")||"No target keywords yet"}</p><b>Model answer</b><p>{markResult.model}</p></div>}</Panel></div><Panel title="Automatic mistake notebook"><p>{mistakes.length?mistakes.join(" · "):"No missed topics recorded yet. Missed quiz questions will appear here."}</p><button className="zsm-secondary" onClick={()=>setMistakes([])}>Clear notebook</button></Panel></section>}

      {page==="Practical Room" && <section><div className="zsm-section-intro"><h2>Combined Science 4003 — Practical Room</h2><p>Interactive simulated practicals. The lab view and results are educational models, not real equipment.</p></div><div className="zsm-lab-layout"><Panel title="Practical selector"><select value={selectedPractical} onChange={e=>{setSelectedPractical(e.target.value);setLabStep(0);setReport("")}}>{practicals.map(p=><option key={p}>{p}</option>)}</select><label>Unknown sample</label><select value={sample} onChange={e=>setSample(e.target.value)}><option>Both nutrients</option><option>Starch only</option><option>Reducing sugar only</option><option>Neither</option></select><div className="zsm-scene"><div className="zsm-scene-label">FIRST-PERSON BENCH VIEW</div><div className="zsm-bench"><div className="zsm-tube"><span>{labStep===0?"A":labStep===1?(sample.includes("Starch")||sample==="Both nutrients"?"Blue-black":"Yellow-brown"):"Result"}</span></div><div className="zsm-tube"><span>{labStep<2?"B":sample==="Neither"?"Blue":"Orange-red"}</span></div><div className="zsm-flask">⚗</div></div><div className="zsm-scene-label">CLASSROOM WALK VIEW · SIMULATED</div><div className="zsm-classroom"><span>Bench 1</span><span>Bench 2</span><span>Demonstration bench</span></div></div><p className="zsm-muted">Selected practical: {selectedPractical}</p><div className="zsm-inline"><button onClick={()=>setLabStep(s=>Math.min(2,s+1))} disabled={labStep>=2}>Run next step</button><button className="zsm-secondary" onClick={()=>{setLabStep(0);setReport("")}}>Reset simulation</button></div><p>Step {labStep+1}/3: {["Set up and label apparatus.","Perform the simulated test and observe the result.","Interpret the observation and record your conclusion."][labStep]}</p></Panel><Panel title="Live results & report builder"><div className="zsm-plot"><svg viewBox="0 0 300 150" role="img" aria-label="Illustrative practical plot"><path d="M30 10V125H285" stroke="currentColor" fill="none"/><path d="M35 112 Q100 110 145 70 T280 20" stroke="#087c70" strokeWidth="3" fill="none"/><text x="90" y="145" fontSize="10">Illustrative trend (not measured data)</text></svg></div><p className="zsm-muted">Graph is a demonstration visualization. Actual measurements are not collected by this prototype.</p><label>Observation</label><textarea rows="2" id="lab-observation" placeholder="Record what you observed…"/><label>Conclusion</label><textarea rows="2" id="lab-conclusion" placeholder="State what the observation means…"/><button onClick={()=>{setReport(`Practical: ${selectedPractical}\\nSample: ${sample}\\nObservation: ${document.getElementById("lab-observation").value}\\nConclusion: ${document.getElementById("lab-conclusion").value}\\nPrecautions: Use eye protection; follow teacher instructions; use safe equipment.`)}}>Build practical report</button>{report&&<pre className="zsm-report">{report}</pre>}<button className="zsm-secondary" onClick={()=>{navigator.clipboard?.writeText(report);setNotice("Report copied if clipboard permission is available.")}}>Copy report</button></Panel></div><Panel title="Science diagram labelling practice"><p>Label a simplified microscope: identify the eyepiece, objective lens, stage and mirror/light source.</p><div className="zsm-diagram"><div className="zsm-microscope">🔬</div><div><label>Eyepiece</label><input placeholder="Enter label"/><label>Stage</label><input placeholder="Enter label"/><label>Objective lens</label><input placeholder="Enter label"/><label>Light source</label><input placeholder="Enter label"/></div></div></Panel><div className="zsm-warning">Safety notice: This is a digital simulation, not a substitute for supervised laboratory work. Follow your teacher’s instructions and use appropriate protective equipment in real practicals.</div></section>}

      {page==="AI Tutor" && <section><div className="zsm-section-intro"><h2>AI Tutor</h2><p>Guided step-by-step study with a photo-question placeholder.</p></div><Panel title="Ask your tutor"><div className="zsm-chat">{tutorMessages.map((m,i)=><div key={i}><div className="zsm-chat-user">{m.q}</div><div className="zsm-chat-answer">{m.a}</div></div>)}</div><textarea rows="3" value={tutorPrompt} onChange={e=>setTutorPrompt(e.target.value)} placeholder="Ask a question…"/><div className="zsm-inline"><button onClick={askTutor}>Send question</button><label className="zsm-upload">Ask from a photo <input type="file" accept="image/*" onChange={()=>setNotice("Photo upload UI is present; image interpretation requires a connected AI backend.")}/></label></div><p className="zsm-muted">Live AI requires a secure backend. Do not expose API keys in the browser or repository.</p></Panel></section>}

      {page==="Exam Simulations" && <section><div className="zsm-section-intro"><h2>Timed ZIMSEC-style exam simulations</h2><p>Practice timing, review answers and generate an indicative readiness summary.</p></div><Panel title="Exam setup"><label>Duration (minutes)</label><input type="number" min="5" max="180" value={examMinutes} onChange={e=>setExamMinutes(Math.max(5,+e.target.value||20))}/><p>Practice set: {bank.length} questions · Mixed subjects</p><button onClick={()=>{setExamStarted(true);setExamScore(null)}}>{examStarted?"Restart simulation":"Start simulation"}</button>{examStarted&&<div className="zsm-exam"><p>Question 1: {bank[0].q}</p>{bank[0].options.map((o,i)=><button className="zsm-option" key={i} onClick={()=>setExamScore(i===bank[0].answer?1:0)}>{o}</button>)}{examScore!==null&&<div className="zsm-feedback">Indicative readiness snapshot: {examScore? "Strong response on this item.":"Review this topic before the next attempt."}<p>Report: 1 item attempted. This demo does not run a server-side timer or official marking.</p></div>}</div>}</Panel></section>}

      {page==="Classrooms" && <section><div className="zsm-section-intro"><h2>Multi-role classrooms</h2><p>Classroom and study-group interface preview.</p></div><div className="zsm-grid two"><Panel title="Online classroom"><span className="zsm-chip">Demo mode</span><p>No live session is connected. A production classroom needs a meeting provider, authentication and moderation controls.</p><button onClick={()=>setNotice("Classroom join flow is a prototype. Connect a live classroom provider to enable sessions.")}>Join classroom</button></Panel><Panel title="Moderated study groups"><label>Group message</label><textarea rows="3" placeholder="Share a study question…"/><button onClick={()=>setNotice("Message saved as a local demo action. Live groups require accounts and moderation.")}>Post to group</button><p className="zsm-muted">Use respectful language. Do not share personal details or answer keys for active assessments.</p></Panel></div>{role==="Teacher-Admin"&&<Panel title="Teacher-Admin controls"><p>Demo controls: manage classroom notices, review issue reports and prepare class practice sets.</p><button onClick={()=>setModal("report")}>Review issue form</button></Panel>}</section>}

      {page==="Tutor Directory" && <section><div className="zsm-section-intro"><h2>Tutor directory</h2><p>Directory preview. Listings are not verified in this prototype.</p></div><Panel title="Find a tutor"><label>Subject</label><select>{subjects.map(s=><option key={s[0]}>{s[0]}</option>)}</select><p>No tutor listings are currently connected. Ask a parent/guardian or teacher to verify qualifications and agree on fees before paying.</p><button onClick={()=>setNotice("Tutor directory is a demo. Connect a verified listings service to show tutors.")}>Search directory</button></Panel></section>}

      {role==="Parent" && <div className="zsm-role-note"><b>Parent view:</b> Progress and study-plan tools are shown locally. Student accounts, consent and secure data sharing must be configured before real monitoring.</div>}
      <footer className="zsm-footer">ZimSchool Max • Educational practice prototype • Not affiliated with ZIMSEC</footer>
    </main>

    {modal && <div className="zsm-modal-backdrop" onClick={()=>setModal("")}><div className="zsm-modal" onClick={e=>e.stopPropagation()}><button className="zsm-modal-close" onClick={()=>setModal("")}>×</button>{modal==="notifications"?<><h2>Notifications</h2><p>No new notifications in this demo.</p></>:modal==="report"?<><h2>Report an issue</h2><label>What happened?</label><textarea rows="4" placeholder="Describe the issue…"/><button onClick={()=>{setModal("");setNotice("Issue report prepared locally. Connect a reporting endpoint to submit it.")}}>Prepare report</button></>:<><h2>Customize timetable</h2><label>Study block</label><input placeholder="e.g. 17:00 — Combined Science"/><button onClick={()=>{setModal("");setNotice("Timetable preference saved for this session.")}}>Save</button></>}</div></div>}
  </div>;
}

function Stat({title,value,detail}) { return <div className="zsm-stat"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>; }
function Panel({title,children}) { return <article className="zsm-panel"><h3>{title}</h3>{children}</article>; }
