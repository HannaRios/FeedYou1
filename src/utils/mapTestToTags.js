export function mapTestToTags(testAnswers) {
  const tags = [];
  
  // Extraer tags de las respuestas del test
  Object.values(testAnswers).forEach(answers => {
    if (Array.isArray(answers)) {
      answers.forEach(answer => {
        const tag = answer.toLowerCase().replace(/\s+/g, '-');
        tags.push(tag);
      });
    }
  });
  
  // Si no hay tags, usar algunos por defecto
  if (tags.length === 0) {
    return ['inspiration', 'art', 'creative'];
  }
  
  return tags;
}