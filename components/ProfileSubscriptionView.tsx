import React from 'react';
import { UserProfile } from '../types';
import { SubHeader } from './SubHeader';
import { SubscriptionCard } from './SubscriptionCard';

interface ProfileSubscriptionViewProps {
  state: UserProfile;
  onBack: () => void;
}

export const ProfileSubscriptionView: React.FC<ProfileSubscriptionViewProps> = ({ 
  state, 
  onBack 
}) => {
  const isDark = state.theme === 'black' || state.theme === 'slate';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Layanan Rival" onBack={onBack} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubscriptionCard 
          tier="free"
          price="GRATIS"
          title="AD-SUPPORTED"
          description="Generate hingga 20 gambar per hari dengan mendukung sistem melalui iklan video."
          benefits={['20 Visual / Hari', 'Akses Model Dasar']}
          buttonText="nonton iklan 1x"
          onSubscribe={() => alert("Menyiapkan video iklan...")}
          isDark={isDark}
        />

        <SubscriptionCard 
          tier="pro"
          price="Rp 5.000"
          title="PRO PLAN"
          description="Dapatkan kuota lebih besar untuk kreativitas Anda. Ideal untuk penggunaan rutin."
          benefits={['40 Visual / Hari', 'Akses Model Pro', 'Web Studio Lite']}
          buttonText="langganan"
          onSubscribe={() => alert("Menghubungkan ke sistem pembayaran (Midtrans)...")}
          isDark={isDark}
          isPopular={true}
        />

        <SubscriptionCard 
          tier="ultimate"
          price="Rp 15.000 / bln"
          title="ULTIMATE"
          description="Akses tanpa batas ke seluruh ekosistem Rival Neural Engine tanpa kompromi."
          benefits={['Unlimited Visual', 'Web Studio Pro', 'Prioritas Neural', 'Enkripsi VIP']}
          buttonText="langganan"
          onSubscribe={() => alert("Menghubungkan ke sistem pembayaran (Midtrans)...")}
          isDark={isDark}
        />
      </div>
    </div>
  );
};
