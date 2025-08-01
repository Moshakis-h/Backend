const verify = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ isAuthenticated: false });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(200).json({ isAuthenticated: false });
    }

    res.status(200).json({
      isAuthenticated: true,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        redirectPage: user.redirectPage
      }
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(200).json({ isAuthenticated: false });
  }
};