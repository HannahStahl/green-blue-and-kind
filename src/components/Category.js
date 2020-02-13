import React, { useState, useEffect } from 'react';
import ProductsList from './ProductsList';
import config from '../config';
import Filter from './Filter';

export default function Category(props) {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = [
      fetch(`${config.apiURL}/products/${props.match.params.id}`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToPhotos`).then(res => res.json()),
      fetch(`${config.apiURL}/photos`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToTags`).then(res => res.json()),
      fetch(`${config.apiURL}/tags`).then(res => res.json()),
    ];
    Promise.all(promises).then((results) => {
      const [products, productsToPhotos, photos, productsToTags, tags] = results;
      products.forEach((product, index) => {
        const photoIds = productsToPhotos
          .filter(productToPhoto => productToPhoto.productId === product.productId)
          .map(productToPhoto => productToPhoto.photoId);
        products[index].productPhotos = photos.filter(photo => photoIds.includes(photo.photoId));
        const tagIds = productsToTags
          .filter(productToTag => productToTag.productId === product.productId)
          .map(productToTag => productToTag.tagId);
        products[index].productTagIds = tags.map(tag => tag.tagId).filter(tagId => tagIds.includes(tagId));
      });
      setProducts(products);
      setTags(tags);
      setLoading(false);
    });
  }, [props.match.params.id]);

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
    while (i < product.productTagIds.length && !selectedTagIdFound) {
      const productTagId = product.productTagIds[i];
      if (selectedTagIds.includes(productTagId)) {
        selectedTagIdFound = true;
      }
      i += 1;
    }
    return selectedTagIdFound;
  }

  const productsToDisplay = products ? products.filter(shouldDisplayProduct) : [];

  return !loading && (
    <div className="page-content category-page">
      <Filter tags={tags} selectedIds={selectedTagIds} toggleTag={toggleTag} />
      {productsToDisplay.length > 0 ? (
        <div>
          <ProductsList alignment="center" products={productsToDisplay} />
          <p className="prices-note">* Note that prices may not be up-to-date and are subject to change at any time.</p>
        </div>
      ) : <div className="no-items"><p>No products with the selected filters.</p></div>}
    </div>
  );
};
