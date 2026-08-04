import React from 'react';

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

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
  const negMarginClass = density === 'high' ? '-mx-2 -mt-2 mb-2' : density === 'medium' ? '-mx-3 -mt-3 mb-3' : '-mx-4 -mt-4 mb-4';

  // Tailwind column classes mapping based on columnsCount prop
  const colsConfig = {
    1: 'columns-1',
    2: 'columns-1 sm:columns-2',
    3: 'columns-1 sm:columns-2 md:columns-3',
    4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
    5: 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5',
  };
  const columnClass = colsConfig[columnsCount] || colsConfig[5];

  // 1. Pad listings with high-quality filler ads if there are fewer than 12 total listings
  // to guarantee we cover all columns and fill the space completely.
  let displayedListings = [...listingsData];
  if (displayedListings.length < 12) {
    const needed = 12 - displayedListings.length;
    const fillers = [
      {
        category: "Featured Services",
        subCategory: "JobPortal Ads",
        title: "Post Your Job Ad Here",
        content: "Looking to hire quickly? Post your vacancy in our Classifieds section. Direct candidate replies straight to your WhatsApp!",
        isUrgent: false,
        isFeatured: true,
        whatsappNumber: "+919876543210",
        isFiller: true
      },
      {
        category: "Career Support",
        subCategory: "ResumeBuilder",
        title: "Free Resume Review",
        content: "Stand out in search results. Send your current CV via WhatsApp for a professional recruiter review and format upgrade.",
        isUrgent: false,
        isFeatured: false,
        whatsappNumber: "+919876543210",
        isFiller: true
      },
      {
        category: "Skill Training",
        subCategory: "CodeCamp India",
        title: "React & Frontend Bootcamp",
        content: "Learn modern React, Tailwind, and Node.js with live industry projects. 100% interview preparation and job referrals.",
        isUrgent: true,
        isFeatured: false,
        whatsappNumber: "+919876543210",
        isFiller: true
      },
      {
        category: "Helpdesk",
        subCategory: "JobPortal India",
        title: "WhatsApp Alerts Subscription",
        content: "Get daily job updates matching your skills directly in your WhatsApp inbox. Free forever service. Chat with us to subscribe.",
        isUrgent: false,
        isFeatured: false,
        whatsappNumber: "+919876543210",
        isFiller: true
      },
      {
        category: "Freelance",
        subCategory: "GigPortal",
        title: "Remote Gig Seekers Wanted",
        content: "Part-time transcription, data entry, and translation projects available. Flexible hours, daily payments. Inquire now.",
        isUrgent: false,
        isFeatured: false,
        whatsappNumber: "+919876543210",
        isFiller: true
      },
      {
        category: "Business Opportunity",
        subCategory: "Agent Program",
        title: "Become a JobPortal Partner Agent",
        content: "Refer local employers to post jobs and earn up to ₹500 commission per active posting. Sign up from your dashboard tab.",
        isUrgent: false,
        isFeatured: true,
        whatsappNumber: "+919876543210",
        isFiller: true
      }
    ];
    
    // Add only as many fillers as needed to hit 12 (using circular mod for safety)
    const fillersToAdd = [];
    for (let i = 0; i < needed; i++) {
      fillersToAdd.push({
        ...fillers[i % fillers.length],
        id: `filler-${i}-${Date.now()}`
      });
    }
    displayedListings = [...displayedListings, ...fillersToAdd];
  }

  // Get distinct group headers (either classified_heading if present, or category if not)
  const groupNames = [...new Set(displayedListings.map(item => item.classified_heading || item.category))].filter(Boolean);
  
  // Set chunk size to 3 so tall categories are split and distributed across columns
  const chunkSize = 3;
  
  // 2. Chunk listings per group header to allow blocks to distribute evenly across columns
  const categoryCards = [];
  groupNames.forEach((groupName) => {
    const groupListings = displayedListings.filter(item => (item.classified_heading || item.category) === groupName);
    const chunks = chunkArray(groupListings, chunkSize);
    chunks.forEach((chunk, index) => {
      categoryCards.push({
        category: groupName,
        listings: chunk,
        key: `${groupName}-${index}`
      });
    });
  });

  // Sort categoryCards by listings count descending (LPT first for better balance)
  categoryCards.sort((a, b) => b.listings.length - a.listings.length);

  // 3. Distribute category cards into columns using height-balanced greedy approach
  const columns = Array.from({ length: columnsCount }, () => []);
  const columnHeights = Array(columnsCount).fill(0);
  
  categoryCards.forEach((card) => {
    let minColIdx = 0;
    let minHeight = columnHeights[0];
    for (let i = 1; i < columnsCount; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        minColIdx = i;
      }
    }
    columns[minColIdx].push(card);
    // Estimate card height: title header is ~1.5 units, each listing is ~2 units
    columnHeights[minColIdx] += 1.5 + card.listings.length * 2;
  });

  // Dynamic Tailwind column classes
  const gridColsClass = 
    columnsCount === 1 ? 'grid-cols-1' :
    columnsCount === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    columnsCount === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} ${gapClass}`}>
      {/* Render distributed columns */}
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {column.map((card, idx) => {
            const headerColor = idx % 2 === 0 ? primaryColors.accent : primaryColors.accentSecondary;
            
            return (
              <div key={card.key} className="border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
                <div 
                  className="text-white font-bold text-[11px] tracking-widest text-center py-2 uppercase"
                  style={{ backgroundColor: headerColor }}
                >
                  {card.category}
                </div>
                
                <div className="flex flex-col">
                  {card.listings.map((listing, lIdx) => {
                    // Bold first few words for newspaper feel
                    const words = (listing.content || '').split(' ');
                    const highlightCount = Math.min(3, words.length);
                    const highlighted = words.slice(0, highlightCount).join(' ');
                    const rest = words.slice(highlightCount).join(' ');
                    
                    return (
                      <div 
                        key={lIdx}
                        onClick={() => {
                          const phone = (listing.whatsappNumber || '+919876543210').replace(/\D/g, '');
                          const text = `Hi, I am interested in: ${listing.title}. Please share more details!`;
                          window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className={`${paddingClass} ${textClass} border-b border-slate-200 last:border-b-0 hover:bg-indigo-50/50 transition-colors group cursor-pointer relative pb-4`}
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
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {listing.postedDate && !listing.isFiller && (
                              <span className="text-[9px] font-mono text-slate-400">
                                {listing.postedDate}
                              </span>
                            )}
                            {listing.postedDate && !listing.isFiller && listing.reference_number && (
                              <span className="text-slate-300">•</span>
                            )}
                            {listing.reference_number && (
                              <span className="text-[9px] font-mono font-bold text-slate-400">
                                Ref: {listing.reference_number}
                              </span>
                            )}
                            {listing.isFiller && (
                              <span className="text-[8px] text-slate-400 font-medium italic">
                                Sponsored
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Apply Now &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ClassifiedsGrid;
