import React from 'react';

const ClassifiedsGrid = ({ 
  columnsCount = 5, 
  density = 'high', 
  primaryColors = { accent: '#111827', accentSecondary: '#2563EB' }, 
  listingsData = [] 
}) => {
  // Density settings
  const paddingClass = density === 'high' ? 'p-2' : density === 'medium' ? 'p-3' : 'p-4';
  const textClass = density === 'high' ? 'text-[11px] leading-tight' : density === 'medium' ? 'text-xs leading-snug' : 'text-sm leading-normal';
  const gapClass = density === 'high' ? 'gap-3' : density === 'medium' ? 'gap-4' : 'gap-6';

  // Tailwind column classes mapping based on columnsCount prop
  const colsConfig = {
    1: 'columns-1',
    2: 'columns-1 sm:columns-2',
    3: 'columns-1 sm:columns-2 md:columns-3',
    4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
    5: 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5',
  };
  const columnClass = colsConfig[columnsCount] || colsConfig[5];

  // Group listings by category
  const categories = [...new Set(listingsData.map(item => item.category))].filter(Boolean);
  
  return (
    <div className={`w-full ${columnClass} ${gapClass} space-y-4`}>
      


      {/* Render grouped listings */}
      {categories.map((category, idx) => {
        const categoryListings = listingsData.filter(item => item.category === category);
        const headerColor = idx % 2 === 0 ? primaryColors.accent : primaryColors.accentSecondary;
        
        return (
          <div key={category} className="break-inside-avoid mb-4 border border-slate-300 bg-white shadow-sm overflow-hidden">
            <div 
              className="text-white font-bold text-[11px] tracking-widest text-center py-2"
              style={{ backgroundColor: headerColor }}
            >
              {category}
            </div>
            
            <div className="flex flex-col">
              {categoryListings.map((listing, lIdx) => {
                // Bold first few words for newspaper feel
                const words = (listing.content || '').split(' ');
                const highlightCount = Math.min(3, words.length);
                const highlighted = words.slice(0, highlightCount).join(' ');
                const rest = words.slice(highlightCount).join(' ');
                
                return (
                    <div 
                      onClick={() => {
                        const phone = (listing.whatsappNumber || '+919876543210').replace(/\D/g, '');
                        const text = `Hi, I am interested in applying for ${listing.title} listed on JobPortal. Please share more details!`;
                        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className={`${paddingClass} ${textClass} border-b border-slate-200 last:border-b-0 hover:bg-indigo-50/50 transition-colors group cursor-pointer relative`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-black text-[12px] text-slate-900 leading-tight pr-2">{listing.title}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {listing.isUrgent && <span className="text-white bg-rose-600 px-1 py-0.5 text-[8px] font-black rounded-xs animate-pulse">URGENT</span>}
                          {listing.isFeatured && <span className="text-white bg-amber-500 px-1 py-0.5 text-[8px] font-bold rounded-xs">FEATURED</span>}
                        </div>
                      </div>
                      {listing.subCategory && (
                        <p className="text-[9px] font-bold text-slate-500 tracking-wider mb-1">{listing.subCategory}</p>
                      )}
                      <p className="text-slate-800 text-justify">
                        <span className="font-bold mr-1">{highlighted}</span>
                        {rest}
                      </p>
                      <div className="mt-2 text-[10px] font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Apply Now &rarr;</span>
                      </div>
                    </div>


                );
              })}
            </div>
          </div>
        );
      })}
      


    </div>
  );
};

export default ClassifiedsGrid;
