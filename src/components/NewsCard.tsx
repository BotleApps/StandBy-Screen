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
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Body */}
      <div className="p-4 flex-grow min-h-0"> {/* Added min-h-0 */}
        {content.type === 'text' ? (
          <p className="text-gray-600">{content.value}</p>
        ) : (
          <img src={content.value} alt={title} className="w-full h-auto object-contain max-h-48" /> // Added max-h-48 for image size control
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto flex flex-col">
        <div className="flex justify-between items-center text-sm text-gray-500 flex-grow">
          <span>{date}</span>
          <div className="flex flex-wrap gap-1 flex-grow">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tag}
              </span>
            ))}
          <div className="flex items-center mt-auto">
  <span className="text-gray-500">Duration:</span>
  <span className="ml-1 text-gray-700">Icon</span>
  <span className="ml-1 text-gray-700">Duration Value</span>
</div>
</div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
