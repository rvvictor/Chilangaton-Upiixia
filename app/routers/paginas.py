"""Páginas públicas del negocio: /n/{slug} y su cartel imprimible."""

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse

from app.services import negocio as svc
from app.services import paginas

router = APIRouter(tags=["paginas"])


def _pagina_publicada(slug: str) -> dict:
    meta = paginas.meta_pagina(slug)
    if meta is None or paginas.leer_html(slug) is None:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    return meta


@router.get("/n/{slug}", response_class=HTMLResponse)
def ver_pagina(slug: str) -> HTMLResponse:
    meta = _pagina_publicada(slug)
    svc.registrar_evento("vista_pagina", meta["negocio_id"], meta.get("h3"))
    return HTMLResponse(paginas.leer_html(slug))


@router.get("/n/{slug}/cartel", response_class=HTMLResponse)
def ver_cartel(slug: str, request: Request) -> HTMLResponse:
    meta = _pagina_publicada(slug)
    rec = svc.get_negocio(meta["negocio_id"]) or {}
    nombre = rec.get("nombre") or "Negocio de barrio"
    html = paginas.render_cartel(slug, nombre, str(request.base_url))
    return HTMLResponse(html)
