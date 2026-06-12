const calculateComplexity = (scene) => {

  const actors =
    Array.isArray(scene.actors)
      ? scene.actors
      : [];

  const props =
    Array.isArray(scene.props)
      ? scene.props
      : [];

  const specialRequirements =
    Array.isArray(
      scene.specialRequirements
    )
      ? scene.specialRequirements
      : [];

  const location =
    String(
      scene.location || ""
    ).toLowerCase();

  let score = 1;

  const reasons = [];

  score += actors.length;

  if (actors.length >= 5){
  score += 2;
  reasons.push("Large cast");
}

if (
  location.includes("ext")
){
  score += 2;
  reasons.push("Outdoor location");
}

  if (props.length > 5){
    score += 2;
    reasons.push("Many props");
  }

  if (
    specialRequirements.includes(
      "Crowd"
    )
  ) {
    score += 2;
    reasons.push("Crowd scene");
  }

  if (
    scene.specialRequirements.includes(
      "Vehicle"
    )
  ) {
    score += 2;
    reasons.push("Vehicle required");
  }

  if (
    scene.specialRequirements.includes(
      "Animal"
    )
  ) {
    score += 3;
    reasons.push("Animal involved");
  }

  if (
    scene.specialRequirements.includes(
      "Stunt"
    )
  ) {
    score += 3;
    reasons.push("Stunt required");
  }

  score = Math.min(score, 10);

  return {
    score,
    reasons,
  };
};

module.exports = {
  calculateComplexity,
};