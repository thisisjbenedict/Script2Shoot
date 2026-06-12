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

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("scenes");

  const scenes =
    uploadResponse?.analysis?.scenes || [];

  const actors =
    getUniqueActors(scenes);

  const props =
    getUniqueProps(scenes);

  const costumes =
    getUniqueCostumes(scenes);

  const locations =
    getUniqueLocations(scenes);

  const locationGroups =
  getLocationGroups(
    scenes
  );

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

      const result =
        await uploadScript(formData);

      setUploadResponse(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AD Copilot</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(event) => {
          setSelectedFile(
            event.target.files[0]
          );
        }}
      />

      {isUploading ? (
        <p>Uploading...</p>
      ) : (
        <button
          disabled={isUploading}
          onClick={handleUpload}
        >
          Upload
        </button>
      )}

      {error && (
        <p>Error: {error}</p>
      )}

      {uploadResponse && (
        <div>

          <h2>Project Summary</h2>

          <p>
            {
              uploadResponse.analysis
                ?.projectSummary
            }
          </p>

          <p>
            <strong>Genre:</strong>{" "}
            {
              uploadResponse.analysis
                ?.genre
            }
          </p>

          <p>
            <strong>
              Estimated Scene Count:
            </strong>{" "}
            {
              uploadResponse.analysis
                ?.estimatedSceneCount
            }
          </p>

          <hr />

          <div>
            <button
              onClick={() =>
                setActiveTab("scenes")
              }
            >
              Scenes
            </button>

            <button
              onClick={() =>
                setActiveTab("actors")
              }
            >
              Actors
            </button>

            <button
              onClick={() =>
                setActiveTab("props")
              }
            >
              Props
            </button>

            <button
              onClick={() =>
                setActiveTab("costumes")
              }
            >
              Costumes
            </button>

            <button
              onClick={() =>
                setActiveTab("locations")
              }
            >
              Locations
            </button>
            <button
  onClick={() =>
    setActiveTab(
      "locationGroups"
    )
  }
>
  Location Groups
</button>
          </div>

          <hr />

          {activeTab === "scenes" && (
            <div>

              {scenes.map((scene) => (
                <div
                  key={
                    scene.sceneNumber
                  }
                  style={{
                    border:
                      "1px solid gray",
                    padding: "10px",
                    marginBottom:
                      "10px",
                  }}
                >
                  <h3>
                    Scene{" "}
                    {
                      scene.sceneNumber
                    }
                  </h3>

                  <p>
                    <strong>
                      Title:
                    </strong>{" "}
                    {scene.title}
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {scene.location}
                  </p>

                  <p>
                    <strong>
                      Actors:
                    </strong>{" "}
                    {scene.actors.join(
                      ", "
                    )}
                  </p>

                  <p>
                    <strong>
                      Props:
                    </strong>{" "}
                    {scene.props.join(
                      ", "
                    )}
                  </p>

                  <p>
                    <strong>
                      Costumes:
                    </strong>{" "}
                    {scene.costumes.join(
                      ", "
                    )}
                  </p>

                  <p>
                    <strong>
                      Special
                      Requirements:
                    </strong>{" "}
                    {scene.specialRequirements.join(
                      ", "
                    )}
                  </p>

                  <p>
                    <strong>
                      Complexity:
                    </strong>{" "}
                    {
                      scene.complexityScore
                    }
                    /10
                  </p>

                  <p>
                    <strong>
                      Reasons:
                    </strong>{" "}
                    {scene.complexityReasons.join(
                      ", "
                    )}
                  </p>
                </div>
              ))}

            </div>
          )}

          {activeTab === "actors" && (

  <div>

    {
      actors.map(actor => {

        const actorScenes =
          getActorScenes(
            actor,
            scenes
          );

        return (

          <div
            key={actor}
            style={{
              border:
                "1px solid gray",
              padding: "10px",
              marginBottom:
                "10px"
            }}
          >

            <h3>
              {actor}
            </h3>

            <p>
              Appears in:
            </p>

            <ul>

              {
                actorScenes.map(
                  scene => (

                    <li
                      key={
                        scene.sceneNumber
                      }
                    >
                      Scene{" "}
                      {
                        scene.sceneNumber
                      }
                      {" - "}
                      {
                        scene.title
                      }
                    </li>

                  )
                )
              }

            </ul>

          </div>

        );

      })
    }

  </div>

)}

          {activeTab === "props" && (
            <ul>
              {props.map(
                (prop) => (
                  <li key={prop}>
                    {prop}
                  </li>
                )
              )}
            </ul>
          )}

          {activeTab ===
            "costumes" && (
            <ul>
              {costumes.map(
                (costume) => (
                  <li
                    key={costume}
                  >
                    {costume}
                  </li>
                )
              )}
            </ul>
          )}

          {activeTab ===
            "locations" && (
            <ul>
              {locations.map(
                (location) => (
                  <li
                    key={location}
                  >
                    {location}
                  </li>
                )
              )}
            </ul>
          )}
        
        {
  activeTab ===
    "locationGroups" && (

    <div>

      {
        Object.entries(
          locationGroups
        ).map(
          (
            [
              location,
              locationScenes
            ]
          ) => (

            <div
              key={location}
              style={{
                border:
                  "1px solid gray",
                padding: "10px",
                marginBottom:
                  "10px"
              }}
            >

              <h3>
                {location}
              </h3>

              <ul>

                {
                  locationScenes.map(
                    scene => (

                      <li
                        key={
                          scene.sceneNumber
                        }
                      >
                        Scene{" "}
                        {
                          scene.sceneNumber
                        }
                        {" - "}
                        {
                          scene.title
                        }
                      </li>

                    )
                  )
                }

              </ul>

            </div>

          )
        )
      }

    </div>

)
}
        </div>
      )}
    </div>
  );
}

export default App;