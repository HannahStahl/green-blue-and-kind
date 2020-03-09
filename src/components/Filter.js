import React, { useState, useEffect } from 'react';

export default function Filter({ tags, selectedIds, toggleTag }) {
  const [selectedTagIds, setSelectedTagIds] = useState(selectedIds);
  useEffect(() => {
    setSelectedTagIds(selectedIds);
  }, [selectedIds]);
  return (
    <span className="filter">
      <span className="filter-label"><p>{tags.length > 0 ? 'Filter:' : ''}</p></span>
      <span className="tags">
        {tags.map((tag) => {
          const selected = selectedTagIds.includes(tag.tagId);
          const className = `tag${selected ? ' selected' : ''}`;
          return (
            <span
              key={tag.tagId}
              className={className}
              onClick={() => toggleTag(tag.tagId)}
            >
              <p>{tag.tagName}</p>
            </span>
          );
        })}
      </span>
    </span>
  );
}
