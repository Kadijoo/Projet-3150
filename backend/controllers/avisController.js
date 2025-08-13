const Avis = require("../models/Avis");

exports.create = async (req, res) => {
  try {
    const avis = new Avis(req.body);
    await avis.save();
    res.status(201).json(avis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// controllers/avisController.js
exports.getAll = async (req, res) => {
  try {
    // On récupère large et on reste en lean pour mapper nous-mêmes
    const raw = await Avis.find({})
      .select("_id note contenu date_avis auteur utilisateur menu plat cible cibleModel")
      .lean();

    const data = raw
      .map((a) => {
        // auteur peut s'appeler "auteur" ou "utilisateur" selon les versions
        const auteur = a.auteur || a.utilisateur || null;

        // cible/cibleModel peuvent déjà exister ; sinon on les infère depuis menu/plat
        let cibleModel = a.cibleModel;
        let cible = a.cible;

        if (!cibleModel || !cible) {
          if (a.menu) {
            cibleModel = "Menu";
            cible = a.menu;
          } else if (a.plat) {
            cibleModel = "Plat";
            cible = a.plat;
          }
        }

        // si on ne sait toujours pas la cible, on ignore cet avis
        if (!cibleModel || !cible) return null;

        return {
          _id: a._id,
          note: a.note ?? null,
          contenu: a.contenu ?? "",
          date_avis: a.date_avis ?? null,
          auteur,
          cibleModel,
          cible,
        };
      })
      .filter(Boolean)
      // tri récent -> ancien pour coller à tes attentes côté UI
      .sort((x, y) => new Date(y.date_avis || 0) - new Date(x.date_avis || 0));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/*exports.getAvis = async (req, res) => {
  try {
    const avis = await Avis.find({ cibleModel: { $in: ["Menu", "Plat"] } })
      .select("_id cible cibleModel note contenu date_avis auteur")
      .sort({ date_avis: -1 })
      .lean();
    res.json(avis);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};*/

exports.getById = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id).populate("restaurant").populate("user");
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const avis = await Avis.find({ utilisateur: req.params.userId }).populate("plat").populate("menu");
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
    res.json(avis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndDelete(req.params.id);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
    res.json({ message: "Avis supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

