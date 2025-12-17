"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { formatWon } from "@/lib/format";

type ShopItem = {
  id: string;
  custom_link: string;
  campaigns: {
    reward_type: string;
    reward_amount: number;
    products: {
      name: string;
      price: number;
      image_url: string | null;
      description: string;
    };
  };
};

export default function MyShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMyShopItems();
  }, []);

  const fetchMyShopItems = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("my_shop_items")
      .select(
        `
        id,
        custom_link,
        campaigns (
          reward_type,
          reward_amount,
          products (
            name,
            price,
            image_url,
            description
          )
        )
      `,
      )
      .eq("creator_id", user.id);

    if (error) {
      console.error(error);
    } else {
      // @ts-ignore
      setItems(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* My Shop Header */}
      <div className="bg-[var(--primary)] text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">My Select Shop</h1>
        <p className="text-lg text-white/80">
          제가 직접 써보고 추천하는 제품들입니다.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-[var(--neutral-200)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square bg-[var(--neutral-100)] mb-4 rounded-xl overflow-hidden relative border border-[var(--border)]">
                  {item.campaigns.products.image_url ? (
                    <img
                      src={item.campaigns.products.image_url}
                      alt={item.campaigns.products.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--neutral-400)]">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white text-[var(--primary)] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg">
                      구매하러 가기 <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {item.campaigns.products.name}
                  </h3>
                  <p className="text-[var(--neutral-600)] mb-3 line-clamp-2">
                    {item.campaigns.products.description}
                  </p>
                  <p className="font-bold text-xl text-[var(--primary)]">
                    {formatWon(item.campaigns.products.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <EmptyState
            title="아직 담은 상품이 없습니다."
            action={
            <Link
                href="/campaigns"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              캠페인 탐색하러 가기 &rarr;
            </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
