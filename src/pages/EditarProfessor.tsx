import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { apiGetToken, apiPatchToken } from "@/service/api";
import { useToast } from "@/hooks/use-toast";

const EditarProfessor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [departamento, setDepartamento] = useState("");
  const [areas, setAreas] = useState("");
  const [biografia, setBiografia] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      try {
        const data = await apiGetToken(`http://127.0.0.1:8000/api/professor/${id}/`);
        setDepartamento(data.departamento || "");
        // areas_pesquisa pode ser array ou string; normalizar para CSV
        if (Array.isArray(data.areas_pesquisa)) {
          setAreas((data.areas_pesquisa as string[]).filter(Boolean).join(", "));
        } else if (typeof data.areas_pesquisa === "string") {
          const raw = data.areas_pesquisa.trim();
          if (raw.startsWith("[") && raw.endsWith("]")) {
            try {
              const parsed = JSON.parse(raw.replace(/'/g, '"'));
              if (Array.isArray(parsed)) {
                setAreas(parsed.map(String).filter(Boolean).join(", "));
              } else {
                setAreas("");
              }
            } catch {
              // fallback para CSV-like / remove brackets/quotes
              const cleaned = raw.replace(/\[|\]|'/g, "").split(",").map((s: string) => s.trim()).filter(Boolean);
              setAreas(cleaned.join(", "));
            }
          } else {
            setAreas(raw);
          }
        } else {
          setAreas("");
        }
        setBiografia(data.biografia || "");
      } catch (err: any) {
        toast({ title: "Erro", description: err.message || "Não foi possível carregar dados.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, toast]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);

    try {
      // Converter áreas em array quando possível
      const areasArray = areas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        departamento: departamento || null,
        areas_pesquisa: areasArray.length > 0 ? areasArray : null,
        biografia: biografia || null,
      };

      // Tentativa primária: PATCH com token (para APIs que suportam)
      const token = localStorage.getItem("accessToken");
      const url = `http://127.0.0.1:8000/api/professor/${id}/`;

      let res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      // Se o backend não suportar PATCH, tentar PUT como fallback
      if (res.status === 405) {
        res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erro na requisição (${res.status})`);
      }

      toast({ title: "Perfil atualizado", description: "As informações foram salvas." });
      navigate(`/professor/${id}`);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Não foi possível salvar.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#141433] to-[#2a0b59] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-white">Editar Perfil</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-white/80">Departamento</label>
              <Input value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="mt-2" />
            </div>

            <div>
              <label className="text-sm text-white/80">Áreas de pesquisa (separadas por vírgula)</label>
              <Input value={areas} onChange={(e) => setAreas(e.target.value)} className="mt-2" />
            </div>

            <div>
              <label className="text-sm text-white/80">Biografia</label>
              <Textarea value={biografia} onChange={(e) => setBiografia(e.target.value)} className="mt-2 h-32" />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving || loading} className="bg-indigo-600">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarProfessor;
