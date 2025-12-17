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


