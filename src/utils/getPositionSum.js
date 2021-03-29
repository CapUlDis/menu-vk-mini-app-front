export default function getPositionSum(group) {
  if (!group.Categories) return 0;

  return group.Categories.reduce((result, category) => {
    if (!category.Positions || category.Positions.length === 0) return result;
    
    result += category.Positions.length;
    return result;
  }, 0)
}