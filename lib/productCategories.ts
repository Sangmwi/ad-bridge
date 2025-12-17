export type ProductCategory = {
  id: string;
  parent_id: string | null;
  depth: 1 | 2;
  slug: string;
  name: string;
};

export type CategoryTreeNode = {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
};

export type CategoryWithParent = {
  id: string;
  name: string;
  parent_id: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
};

/**
 * 카테고리 트리 구조 생성
 */
export function buildCategoryTree(rows: ProductCategory[]): CategoryTreeNode[] {
  const parents = rows.filter((r) => r.depth === 1);
  const children = rows.filter((r) => r.depth === 2 && r.parent_id);
  const childByParent = new Map<string, ProductCategory[]>();

  for (const c of children) {
    const list = childByParent.get(c.parent_id!) ?? [];
    list.push(c);
    childByParent.set(c.parent_id!, list);
  }

  return parents.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    children: (childByParent.get(p.id) ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
  }));
}

/**
 * 카테고리 배열에서 특정 ID의 카테고리 찾기
 */
export function findCategoryById(
  categories: ProductCategory[],
  categoryId: string | null | undefined
): ProductCategory | null {
  if (!categoryId) return null;
  return categories.find((c) => c.id === categoryId) || null;
}

/**
 * 카테고리 배열에서 parent 카테고리 찾기
 */
export function findParentCategory(
  categories: ProductCategory[],
  category: { parent_id: string | null }
): ProductCategory | null {
  if (!category.parent_id) return null;
  return findCategoryById(categories, category.parent_id);
}


