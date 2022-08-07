import React, { useState } from 'react';
import ProductsList from './ProductsList';
import Filter from './Filter';

export default function Category(props) {
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const { match, categories, tags } = props;
  const categoryName = unescape(match.params.category).replace(/_/g, ' ');
  const category = categories.find((categoryInList) => (
    categoryInList.name.toLowerCase() === categoryName.toLowerCase()
  ));
  if (!category) window.location.pathname = '/page-not-found';

  function toggleTag(tagId) {
    const index = selectedTagIds.indexOf(tagId);
    if (index > -1) {
      selectedTagIds.splice(index, 1);
    } else {
      selectedTagIds.push(tagId);
    }
    setSelectedTagIds([...selectedTagIds]);
  }

  function shouldDisplayProduct(product) {
    if (selectedTagIds.length === 0) {
      return true;
    }
    let selectedTagIdFound = false;
    let i = 0;
    while (product.tags && i < product.tags.length && !selectedTagIdFound) {
      const productTagId = product.tags[i]._id;
      if (selectedTagIds.includes(productTagId)) {
        selectedTagIdFound = true;
      }
      i += 1;
    }
    return selectedTagIdFound;
  }

  const productsToDisplay = category.products.filter(shouldDisplayProduct);

  return (
    <div className="page-content category-page">
      <Filter tags={tags} selectedIds={selectedTagIds} toggleTag={toggleTag} />
      {productsToDisplay.length > 0 ? (
        <div>
          <ProductsList alignment="center" products={productsToDisplay} category={category} />
          <p className="prices-note">* Note that prices may not be up-to-date and are subject to change at any time.</p>
        </div>
      ) : <div className="no-items"><p>No products with the selected filters.</p></div>}
    </div>
  );
}
