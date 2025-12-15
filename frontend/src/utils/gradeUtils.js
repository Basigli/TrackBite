export const getGradeClass = (grade) => {
  if (!grade) return 'bg-gray-100 text-gray-800';
  
  const gradeMap = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-lime-100 text-lime-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'E': 'bg-red-100 text-red-800'
  };
  
  return gradeMap[grade.toUpperCase()] || 'bg-gray-100 text-gray-800';
};