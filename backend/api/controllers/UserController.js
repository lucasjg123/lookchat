export class UserController {
  constructor(model) {
    this.model = model;
  }

  register = async (req, res) => {
    // we register the user
    const result = await this.model.register(req.validatedData);
    if (result.error) return res.status(400).json(result);

    return res.status(201).json(result);
  };

  // hacer q el modelo devuelva el errore en obj .error
  // si existe .error lanzo eso como res y listo

  login = async (req, res) => {
    const result = await this.model.login(req.validatedData);
    if (result.error) return res.status(400).json(result);

    return res.status(200).json(result); // 200 para una respuesta exitosa
  };
}
