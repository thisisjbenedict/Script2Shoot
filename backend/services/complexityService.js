const calculateComplexity = (scene) => {

  let score = 1;

  const reasons = [];

  score += scene.actors.length;

  if (scene.actors.length >= 5) {
  score += 2;
  reasons.push("Large cast");
}

if (
  scene.location &&
  scene.location.toLowerCase().includes("ext")
) {
  score += 2;
  reasons.push("Outdoor location");
}

  if (scene.props.length > 5) {
    score += 2;
    reasons.push("Many props");
  }

  if (
    scene.specialRequirements.includes(
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