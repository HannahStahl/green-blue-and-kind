import React, { useState, useEffect } from 'react';
import ItemsList from './ItemsList';
import config from '../config';
import Filter from './Filter';

export default function Category(props) {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  useEffect(() => {
    const promises = [
      fetch(`${config.apiURL}/products/${props.match.params.id}`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToPhotos`).then(res => res.json()),
      fetch(`${config.apiURL}/photos`).then(res => res.json()),
      fetch(`${config.apiURL}/tags`).then(res => res.json()),
    ];
    Promise.all(promises).then((results) => {
      const [products, productsToPhotos, photos, tags] = results;
      products.forEach((product, index) => {
        const photoIds = productsToPhotos
          .filter(productToPhoto => productToPhoto.productId === product.productId)
          .map(productToPhoto => productToPhoto.photoId);
        products[index].productPhotos = photos.filter(photo => photoIds.includes(photo.photoId));
      });
      setProducts(products);
      setTags(tags);
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

  return (
    <div className="page-content category-page">
      <Filter tags={tags} selectedIds={selectedTagIds} toggleTag={toggleTag} />
      <ItemsList alignment="center" items={products ? products.map(product => ({
        id: product.productId,
        name: product.productName,
        url: `/products/${product.productId}`,
        photo: product.productPhotos[0].photoName,
      })) : []} />
    </div>
  );
};
