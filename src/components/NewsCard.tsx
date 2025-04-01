import React from 'react';

interface NewsCardProps {
  title: string;
  content: { type: 'text'; value: string } | { type: 'image'; value: string };
  date: string; // e.g., "March 30, 2025"
  tags: string[]; // e.g., ["Company Update", "Tech"]
}

const NewsCard: React.FC<NewsCardProps> = ({ title, content, date, tags }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
       {/* Header */}
       <div className="p-4 border-b border-gray-200">
         <h3 className="text-xl font-semibold text-indigo-600">{title}</h3> {/* Increased size and changed color */}
       </div>
 
      {/* Body */}
      <div className="p-4 flex-grow min-h-0 prose prose-sm max-w-none"> {/* Added min-h-0 and Tailwind Typography classes */}
        {content.type === 'text' ? (
          // Use dangerouslySetInnerHTML to render the HTML from the rich text editor
          <div dangerouslySetInnerHTML={{ __html: content.value }} />
        ) : (
          <img src={content.value} alt={title} className="w-full h-auto object-contain max-h-48" />
        )}
      </div>

       {/* Footer */}
       <div className="p-4 border-t border-gray-200 mt-auto"> {/* Removed flex flex-col */}
         {/* Use justify-between to push date and tags apart */}
         <div className="flex justify-between items-center text-sm text-gray-500">
           {/* Date on the left */}
           <span>{date}</span>
           {/* Tags container on the right */}
           <div className="flex flex-wrap gap-1 justify-end"> {/* Removed flex-grow, added justify-end */}
             {tags.map((tag, index) => (
               <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                 {tag}
               </span>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
};

export default NewsCard;
