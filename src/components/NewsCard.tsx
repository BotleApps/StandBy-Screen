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
      <div className="p-4 flex-grow">
        {content.type === 'text' ? (
          <p className="text-gray-600">{content.value}</p>
        ) : (
          <img src={content.value} alt={title} className="w-full h-auto object-contain max-h-48" /> // Added max-h-48 for image size control
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{date}</span>
          <div className="flex flex-wrap gap-1">
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
