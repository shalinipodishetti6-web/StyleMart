export const validateOrderDetails = (req, res, next) => {
  // Frontend sends shipping fields nested as `shippingDetails`.
  // Support both nested and legacy top-level payloads.
  const shipping = req.body?.shippingDetails ?? req.body ?? {};
  const paymentMethod = req.body?.paymentMethod;

  const fullName = shipping?.fullName;
  const phone = shipping?.phone;
  const address = shipping?.address;
  const city = shipping?.city;
  const state = shipping?.state;
  const pincode = shipping?.pincode;

  // Check if all fields are provided
  if (!fullName || !phone || !address || !city || !state || !pincode || !paymentMethod) {
    return res.status(400).json({ 
      error: 'Please fill all required details',
      missing: {
        fullName: !fullName,
        phone: !phone,
        address: !address,
        city: !city,
        state: !state,
        pincode: !pincode,
        paymentMethod: !paymentMethod
      }
    });
  }

  // Validate phone number (10 digits)
  if (!/^[0-9]{10}$/.test(String(phone).trim())) {
    return res.status(400).json({ error: 'Phone must be 10 digits' });
  }

  // Validate pincode (6 digits)
  if (!/^[0-9]{6}$/.test(String(pincode).trim())) {
    return res.status(400).json({ error: 'Pincode must be 6 digits' });
  }

  // Validate address (minimum 10 characters)
  if (String(address).trim().length < 10) {
    return res.status(400).json({ error: 'Address must be minimum 10 characters' });
  }

  next();
};

export const validateProduct = (req, res, next) => {
  const { name, price, category, description, stock } = req.body;

  if (!name || !price || !category || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: 'Product name must be at least 3 characters' });
  }

  if (price < 0) {
    return res.status(400).json({ error: 'Price cannot be negative' });
  }

  if (stock < 0) {
    return res.status(400).json({ error: 'Stock cannot be negative' });
  }

  next();
};
