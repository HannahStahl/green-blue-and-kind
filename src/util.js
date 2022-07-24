const constructEmailHtml = (name, message, cart) => {
  let html = `
    <html><head><style>
      h2 {
        font-weight: normal;
      }
      p, td, th {
        font-size: 16px;
      }
      p {
        white-space: pre-wrap;
      }
      td, th {
        padding: 10px;
        border: solid 1px gray;
      }
      th {
        text-align: left;
      }
    </style></head><body>
  `;
  if (cart.items.length > 0) {
    html += `
      <h2><b>${name}</b> has submitted a request for the following items:</h2>
      <table><thead><tr><th>Product</th><th>Size</th><th>Color</th><th>Quantity</th><th>Price</th></tr></thead><tbody>
    `;
    cart.items.forEach((item) => {
      html += `<tr><td>${item.name}</td><td>${item.size}</td><td>${item.color}</td><td>${item.quantity}</td><td>$${item.price}</td></tr>`;
    });
    html += `</tbody></table><p><b>Estimated Total:</b> $${cart.total}</p>`;
    if (message.length > 0) {
      html += `<h2>Additional notes from ${name}:</h2><p>"${message}"</p>`;
    }
    html += '<p><i>You can respond to this request by replying directly to this email.</i></p>';
  } else {
    html += `
      <h2><b>${name}</b> has sent you a message:</h2><p>"${message}"</p>
      <p><i>You can respond to this message by replying directly to this email.</i></p>
    `;
  }
  html += '</body></html>';
  return html;
};

// eslint-disable-next-line import/prefer-default-export
export { constructEmailHtml };
