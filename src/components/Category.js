import React, { useState, useEffect } from 'react';
import ProductsList from './ProductsList';
import config from '../config';
import Filter from './Filter';
import LoadingSpinner from './LoadingSpinner';

export default function Category(props) {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { match } = props;

  useEffect(() => {
    fetch(`${config.apiURL}/publishedCategories`).then((res) => res.json()).then((categories) => {
      const categoryName = match.params.category.replace(/_/g, ' ');
      const thisCategory = categories.find((categoryInList) => (
        categoryInList.categoryName.toLowerCase() === categoryName.toLowerCase()
      ));
      setCategory(thisCategory);
      const { categoryId } = thisCategory;
      const promises = [
        fetch(`${config.apiURL}/publishedProducts/${categoryId}`).then((res) => res.json()),
        fetch(`${config.apiURL}/productsToPhotos`).then((res) => res.json()),
        fetch(`${config.apiURL}/photos`).then((res) => res.json()),
        fetch(`${config.apiURL}/productsToTags`).then((res) => res.json()),
        fetch(`${config.apiURL}/tags`).then((res) => res.json()),
      ];
      Promise.all(promises).then((results) => {
        const [productsInCategory, productsToPhotos, photos, productsToTags, allTags] = results;
        productsInCategory.forEach((product, index) => {
          const productPhotoIds = productsToPhotos
            .filter((productToPhoto) => productToPhoto.productId === product.productId)
            .map((productToPhoto) => productToPhoto.photoId);
          const productPhotos = [];
          productPhotoIds.forEach((photoId) => {
            productPhotos.push(photos.find((photo) => photo.photoId === photoId));
          });
          productsInCategory[index].productPhotos = productPhotos;
          const productTagIds = productsToTags
            .filter((productToTag) => productToTag.productId === product.productId)
            .map((productToTag) => productToTag.tagId);
          const productTags = [];
          productTagIds.forEach((tagId) => {
            productTags.push(allTags.find((tag) => tag.tagId === tagId));
          });
          productsInCategory[index].productTagIds = productTags.map((tag) => tag.tagId);
        });
        setProducts(productsInCategory);
        setTags(allTags);
        setLoading(false);
      });
    });
  }, [match.params.category]);

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

  return loading ? <LoadingSpinner /> : (
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
