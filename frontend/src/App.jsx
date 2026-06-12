import { useState } from "react";
import { uploadScript } from "./services/scriptService";
import {
  getUniqueActors,
  getUniqueProps,
  getUniqueCostumes,
  getUniqueLocations,
  getActorScenes,
  getLocationGroups
} from "./utils/projectAggregation";
import "./App.css";

function Metric({ label, value }) {
  return (
    <div className="metric card">
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

function Tab({ id, active, onClick, children }) {
  return (
    <button
      className={"tab" + (active ? " active" : "")}
      onClick={() => onClick(id)}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ItemCard({ left, title, sub }) {
  return (
    <div className="item-card">
      <div className="item-left">{left}</div>
      <div className="item-main">
        <div className="item-title">{title}</div>
        {sub && <div className="item-sub">{sub}</div>}
      </div>
    </div>
  );
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("scenes");

  const scenes = uploadResponse?.analysis?.scenes ?? [];
  const shootPlan = uploadResponse?.analysis ?.shootPlan || [];
  

  const actors = getUniqueActors(scenes);
  const props = getUniqueProps(scenes);
  const costumes = getUniqueCostumes(scenes);
  const locations = getUniqueLocations(scenes);
  const locationGroups = getLocationGroups(scenes);


  const handleUpload = async () => {
    setError(null);
    setUploadResponse(null);

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("script", selectedFile);

    try {
      setIsUploading(true);
      const result = await uploadScript(formData);
      setUploadResponse(result);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setIsUploading(false);
    }
  };

  const sceneCount = scenes.length;
  const actorCount = actors.length;
  const locationCount = locations.length;
  const propCount = props.length;

  return (
  <div className="app">

    <div className="container">

      <header className="header">

  <div className="hero">

  <h1>Script2Shoot</h1>

  <p className="hero-tagline">
    Transform screenplays into production-ready plans
  </p>

  <p className="subtitle">
    Script Breakdown • Scheduling • Production Planning
  </p>

</div>

<div className="upload-card">

  <div className="file-info">

    {/* <div className="file-icon">
      📄
    </div> */}

    <div>

      <div className="file-name">
        {
          selectedFile
            ? selectedFile.name
            : "Upload screenplay"
        }
      </div>

      {/* <div className="file-status">
        {
          selectedFile
            ? "Ready for AI analysis"
            : "Select a screenplay PDF to begin"
        }
      </div> */}

    </div>

  </div>

  <div className="upload-actions">

    <input
      id="script-upload"
      type="file"
      accept=".pdf"
      hidden
      onChange={(e) =>
        setSelectedFile(
          e.target.files?.[0] || null
        )
      }
    />

    <label
      htmlFor="script-upload"
      className="browse-btn"
    >
      Browse Script
    </label>

    <button
      className="analyze-btn"
      onClick={handleUpload}
      disabled={
        isUploading ||
        !selectedFile
      }
    >
      {
        isUploading
          ? "Analyzing..."
          : "Analyze Script"
      }
    </button>

  </div>

</div>
  
</header>
{sceneCount > 0 && (
  <section className="metrics">

  <Metric
    label="Scenes"
    value={sceneCount}
  />

  <Metric
    label="Actors"
    value={actorCount}
  />

  <Metric
    label="Locations"
    value={locationCount}
  />

  <Metric
    label="Props"
    value={propCount}
  />

</section>
)}
      <section className="tabs">

        <Tab
          id="scenes"
          active={activeTab==="scenes"}
          onClick={setActiveTab}
        >
          Scenes
        </Tab>

        <Tab
          id="actors"
          active={activeTab==="actors"}
          onClick={setActiveTab}
        >
          Actors
        </Tab>

        <Tab
          id="locations"
          active={activeTab==="locations"}
          onClick={setActiveTab}
        >
          Locations
        </Tab>

        <Tab
          id="props"
          active={activeTab==="props"}
          onClick={setActiveTab}
        >
          Props
        </Tab>

        <Tab
          id="shoot"
          active={activeTab==="shoot"}
          onClick={setActiveTab}
        >
          Shoot Plan
        </Tab>

      </section>

      <main className="content">

        {activeTab === "scenes" && (

  <>

    {scenes.map((scene) => (

      <ItemCard
        key={scene.sceneNumber}
        left={scene.sceneNumber}
        title={
          scene.title ||
          scene.slugline
        }
        sub={
  `📍 ${scene.location}
   • 👥 ${scene.actors.length} actors
   • ⚡ Complexity ${scene.complexityScore}`
}
      />

    ))}

  </>

)}

{activeTab === "actors" && (

  <>

    {actors.map((actor) => (

      <ItemCard
        key={actor}
        left="🎭"
        title={actor}
        sub={
  `Appears in ${
    getActorScenes(
      scenes,
      actor
    ).length
  } scenes`
}
      />

    ))}

  </>

)}

{activeTab === "locations" && (

  <>

    {locations.map((location) => {

      const count =
        scenes.filter(
          scene =>
            scene.location === location
        ).length;

      return (

        <ItemCard
          key={location}
          left="📍"
          title={location}
          sub={`${count} scenes`}
        />

      );

    })}

  </>

)}

{activeTab === "props" && (

  <>

    {props.map((prop) => {

      const count =
        scenes.filter(
          scene =>
            scene.props.includes(prop)
        ).length;

      return (

        <ItemCard
          key={prop}
          left="📦"
          title={prop}
          sub={`Used in ${count} scenes`}
        />

      );

    })}

  </>

)}

{activeTab === "shoot" && (

  <div className="shoot-grid">

    {shootPlan.map(day => (

      <div
        key={day.day}
        className="card"
      >

        <h3>
          Day {day.day}
        </h3>

        <p>
          📍 {day.location}
        </p>
<p>
  🎬 Scenes:
  {" "}
  {day.sceneNumbers.join(", ")}
</p>

<p>
  📊 Total Scenes:
  {" "}
  {day.totalScenes}
</p>

<p>
  ⚡ Avg Complexity:
  {" "}
  {day.averageComplexity}
</p>

<p>
  💡 {day.recommendation}
</p>

      </div>

    ))}

  </div>

)}

      </main>

    </div>

  </div>
);
}

export default App;