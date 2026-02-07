const Setting = require('../models/Setting');

// Get all settings (or specific one by key query)
exports.getSettings = async (req, res) => {
    try {
        const settings = await Setting.find({});
        // Convert to key-value object for easier frontend consumption
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsMap);
    } catch (error) {
        console.error("Get Settings Error:", error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

// Update or Create a setting
exports.updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;

        if (!key) {
            return res.status(400).json({ message: "Key is required" });
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value, updatedBy: req.user.id },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.json(setting);
    } catch (error) {
        console.error("Update Setting Error:", error);
        res.status(500).json({ message: "Failed to update setting" });
    }
};
