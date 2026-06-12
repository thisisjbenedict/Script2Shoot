export const getUniqueActors = (scenes) => {

  return [
    ...new Set(
      scenes.flatMap(
        scene => scene.actors || []
      )
    )
  ];

};

export const getUniqueProps = (scenes) => {

  return [
    ...new Set(
      scenes.flatMap(
        scene => scene.props || []
      )
    )
  ];

};

export const getUniqueCostumes = (scenes) => {

  return [
    ...new Set(
      scenes.flatMap(
        scene => scene.costumes || []
      )
    )
  ];

};

export const getUniqueLocations = (scenes) => {

  return [
    ...new Set(
      scenes.map(
        scene => scene.location
      )
    )
  ];

};

export const getActorScenes = (
  actorName,
  scenes
) => {

  return scenes.filter(
    scene =>
      scene.actors?.includes(
        actorName
      )
  );

};

export const getLocationGroups = (
  scenes
) => {

  const grouped = {};

  scenes.forEach(scene => {

    const location =
      scene.location ||
      "Unknown";

    if (!grouped[location]) {
      grouped[location] = [];
    }

    grouped[location].push(scene);

  });

  return grouped;
};