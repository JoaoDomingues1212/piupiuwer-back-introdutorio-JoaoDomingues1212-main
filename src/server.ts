import express, { Request, response, Response } from 'express';
import routes from './routes';
import morgan from 'morgan';
import { uuid } from 'uuidv4';
import { parseISO } from 'date-fns';

const allPius: { id: string; Userid: any; texto: string; DatadeCriacao: any; DatadeAtualizacao: any; }[] = [];
const allUsuarios: { id: string; nome: any; nascimento: any; CPF: any; telefone: any; criacao: any; atualizacao: any; }[] = [];

const app = express();

app.use(express.json());

app.get('/usuario/:id', (req : Request, res: Response) => {
  const { id }= req.params;
  const usuario = allUsuarios.find((usuario) => usuario.id === id)
  if (!usuario){
    throw new Error("usuario nao existe");
  }
    return res.json(usuario);
});

app.get('/usuario', (req : Request, res: Response) => {
  return res.json(allUsuarios);
});

app.post('/usuario', (req : Request, res: Response) => {
  const {nome, nascimento, CPF, telefone, criacao, atualizacao}= req.body;

  const parsedCriacao = parseISO(criacao);
  const parsedAtualizacao = parseISO(atualizacao);

  if (!nome ) throw new Error("Nome incorreto");
  if( !nascimento ) throw new Error("Data de Nascimento incorreta");
  if( !CPF ) throw new Error("CPF incorreto");
  if( !telefone ) throw new Error("Telefone incorreto");
  if(!criacao) throw new Error("Data de criacao incorreta");
  if(!parsedAtualizacao) throw new Error("Data de atualizacao incorreta");
  if (allUsuarios.find((usuario) => usuario.CPF === CPF)) throw new Error("usuario existe");

  const usuario = {id: uuid(), nome, nascimento, CPF, telefone, criacao: parsedCriacao, atualizacao: parsedAtualizacao};
  allUsuarios.push(usuario);

  return res.json(allUsuarios);
  
});

app.get('/piu/:id', (req : Request, res: Response) => {
  const { id }= req.params;
  const piu = allPius.find((piu) => piu.id === id)
  if (!piu){
    throw new Error("piu nao existe");
  }
    return res.json(piu);
});

app.get('/piu', (req : Request, res: Response) => {
  return res.json(allPius);
});

app.post('/piu', (req : Request, res: Response) => {
  const { Userid, texto, DatadeCriacao, DatadeAtualizacao } = req.body;
  
  const userExist = allUsuarios.find((usuario) => usuario.id === Userid);
  const textSize = texto.length;
  const parsedDatadeCriacao = parseISO(DatadeCriacao);
  const parsedDatadeAtualizacao = parseISO(DatadeAtualizacao);

  if ( userExist ) throw new Error("Id do usuario nao existe");
  if ( textSize > 140) throw new Error("Texto deve conter no maximo 140 caracteres");
  if ( textSize === 0) throw new Error("texto deve conter no minimo 1 caracter")

  const piu = { id: uuid(), Userid, texto, DatadeCriacao: parsedDatadeCriacao, DatadeAtualizacao: parsedDatadeAtualizacao };

  allPius.push(piu);
  return res.json(piu);
});

app.delete('/piu/:id', (req : Request, res: Response) => {
  const { id } = req.params;
  if (!allPius.find((post) => post.id === id) === undefined) throw new Error("Piu nao encontrado");

  const piuIndex = allPius.findIndex(post => post.id === id);
  allPius.splice(piuIndex, 1);

  return res.json(allPius);
});

app.delete('/usuario/:id', (req : Request, res: Response) => {
  const { id } = req.params;
  if (!allUsuarios.find((usuario) => usuario.id === id) === undefined) throw new Error("Usuario nao encontrado");

  const userIndex = allUsuarios.findIndex(usuario => usuario.id === id);
  allUsuarios.splice(userIndex, 1);

  return res.json(allUsuarios);
});

app.put('/piu/:id', (req : Request, res: Response) => {
  const { id } = req.params;
  const { texto, DatadeAtualizacao } = req.body;

  if (!allPius.find((post) => post.id === id) === undefined) throw new Error("Piu nao encontrado");

  const parsedDatadeAtualizacao = parseISO(DatadeAtualizacao);
  console.log(texto.length);
  const textSize = texto.length;
  const Piu = allPius.find((post) => post.id === id) as { id: string; Userid: any; texto: any; DatadeCriacao: any; DatadeAtualizacao: any; };
  const newPiu = { id: Piu.id, Userid: Piu.Userid, texto, DatadeCriacao: Piu.DatadeCriacao, DatadeAtualizacao: parsedDatadeAtualizacao };
  
  if ( textSize > 140) throw new Error("Texto deve conter no maximo 140 caracteres");
  if ( textSize === 0) throw new Error("texto deve conter no minimo 1 caracter");

  const piuIndex = allPius.findIndex(post => post.id === id);
  allPius.splice(piuIndex, 1, newPiu);
  
  return res.json(newPiu);
});

app.put('/usuario/:id', (req : Request, res: Response) => {
  const { id } = req.params;
  const { nome, nascimento, CPF, telefone, atualizacao } = req.body;

  
  const parsedAtualizacao = parseISO(atualizacao);

  const user = allUsuarios.find((usuario) => usuario.id === id) as { id: string; nome: any; nascimento: any; CPF: any; telefone: any; criacao: any; atualizacao: any; };
  const newUser = { id: user.id, nome, nascimento, CPF, telefone, criacao: user.criacao, atualizacao: parsedAtualizacao };

  if (!user) throw new Error("Usuario nao encontrado");

  if (!newUser.nome ) throw new Error("Nome incorreto");
  if(!newUser.nascimento) throw new Error("Data de Nascimento incorreta");
  if(!newUser.CPF) throw new Error("CPF incorreto");
  if(!newUser.telefone) throw new Error("Telefone incorreto");
  if(!newUser.atualizacao) throw new Error("Data de atualizacao incorreta");

  const userIndex = allUsuarios.findIndex(usuario => usuario.id === id);
  allUsuarios.splice(userIndex, 1, newUser);

  return res.json(newUser);
});

app.listen(3333, () => {
  console.log(`🚀 \x1b[1;4;96mServer started on port 3333\x1b[0m`);
}); 
