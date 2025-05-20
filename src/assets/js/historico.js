import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from 'moment';

const History = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [perimetrias, setPerimetrias] = useState([]);
    const [dobrascutaneas, setDobrasCutaneas] = useState([]);
    const [selectedDobra, setSelectedDobra] = useState(null); // Adicionando estado para controlar qual dobra está selecionada
    const [selectedPerimetria, setSelectedPerimetria] = useState(null); // Adicionando estado para controlar qual perimetria está selecionada
    const [searchTerm, setSearchTerm] = useState("");

    // Pega os dados da loja
    const fetchLoja = async () => {
        try {
            const responseUser = await axios.get(`https://api.cestsegtrabalho.com.br/${username}`);
            setUserData(responseUser.data);
        } catch (error) {
            console.error("Erro ao buscar os dados da loja: ", error);
        }
    };


    // Pega as perimetrias do usuário
    const fetchPerimetrias = async () => {
        try {
            const responsePerimetrias = await axios.get(`https://api.cestsegtrabalho.com.br/perimetria/${userData._id}`);
            setPerimetrias(responsePerimetrias.data.reverse());
        } catch (error) {
            console.error("Erro ao buscar as perimetrias do usuário: ", error);
        }
    };

    // Pega as dobras cutâneas do usuário
    const fetchDobrasCutaneas = async (userId) => {
        try {
            const responseDobrasCutaneas = await axios.get(`https://api.cestsegtrabalho.com.br/dobrascutaneas/tudo`);
            const dobrasDoUsuario = responseDobrasCutaneas.data
                .filter((d) => d.userId === userId)
                .reverse();
            setDobrasCutaneas(dobrasDoUsuario);
        } catch (error) {
            console.error("Erro ao buscar as dobras cutâneas do usuário: ", error);
        }
    };

    useEffect(() => {
        fetchLoja();
    }, [username]);

    useEffect(() => {
            fetchDobrasCutaneas();
    }, [userData]);

    const handleShowMoreDobra = (dobra) => {
        // Atualiza o estado para mostrar mais dados da dobra selecionada
        setSelectedDobra(selectedDobra === dobra ? null : dobra);
    };

    const handleShowMorePerimetria = (perimetria) => {
        // Atualiza o estado para mostrar mais dados da perimetria selecionada
        setSelectedPerimetria(selectedPerimetria === perimetria ? null : perimetria);
    };

    return (
        <div className="father-historico">
            {userData ? (
                <div className="father-item">
                    {/* Exibir as dobras cutâneas */}
                    
                    <div className="item-history">
                    <h4>Provas feitas recentemente</h4>
                    {/* Barra de pesquisa */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ marginRight: '8px' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar por nome do aluno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                flex: 1,
                            }}
                        />
                    </div>
                        {dobrascutaneas
                        .filter((dobra) =>
                            dobra.subescapular?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((dobra) => (
                            <div key={dobra._id} style={{ marginBottom: '1rem' }}>
                                <p><b>{moment(dobra.createdAt).format('DD/MM/YYYY HH:mm:ss')}</b></p>
                                <p>{dobra.abdominal}</p>
                                <p><b>Aluno:</b> {dobra.subescapular}</p>

                                {selectedDobra === dobra && (
                                    <>
                                        <p><b>Email:</b> {dobra.peitoral}</p>
                                        <p><b>Tel:</b> {dobra.triciptal}</p>
                                        <p><b>CPF:</b> {dobra.coxa}</p>
                                    </>
                                )}

                                <button
                                    onClick={() => handleShowMoreDobra(dobra)}
                                    className="button-history"
                                >
                                    {selectedDobra === dobra ? "Mostrar Menos" : "Mostrar Mais"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Exibir as perimetrias */}
                    
                    {/* <div className="item-history">
                    <h3></h3>
                        {perimetrias.map((perimetria) => (
                            <div key={perimetria._id}>
                                <p><b>{moment(perimetria.createdAt).format('DD/MM/YYYY')}</b> </p>
                                {selectedPerimetria === perimetria && (
                                    <>
                                    <p><b>Braço relaxado esquerdo:</b> {perimetria.bracoRelaxadoEsquerdo}cm</p>
                                    <p><b>Braço relaxado direito:</b> {perimetria.bracoRelaxadoDireito}cm</p>
                                    <p><b>Braço contraído esquerdo:</b> {perimetria.bracoContraidoEsquerdo}cm</p>
                                    <p><b>Braço contraído direito:</b> {perimetria.bracoContraidoDireito}cm</p>
                                    <p><b>Antebraço esquerdo:</b> {perimetria.antebracoEsquerdo}cm</p>
                                    <p><b>Antebraço direito:</b> {perimetria.antebracoDireito}cm</p>
                                    <p><b>Perna esquerda:</b> {perimetria.pernaEsquerdo}cm</p>
                                    <p><b>Perna direita:</b> {perimetria.pernaDireito}cm</p>
                                    <p><b>Torax:</b> {perimetria.torax}cm</p>
                                    <p><b>Abdomen:</b> {perimetria.abdomen}cm</p>
                                    <p><b>Quadril:</b> {perimetria.quadril}cm</p>
                                    </>
                                )}
                               
                                <button onClick={() => handleShowMorePerimetria(perimetria)} className="button-history">
                                    {selectedPerimetria === perimetria ? "Mostrar Menos" : "Mostrar Mais"}
                                </button>
                            </div>
                        ))}
                    </div> */}
                </div>
                
            ) : (
                <p>Carregando dados do usuário...</p>
            )}
        </div>
    );
}

export default History