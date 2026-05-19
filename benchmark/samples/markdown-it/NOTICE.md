# markdown-it benchmark samples

The 27 `.md` / `.txt` files in this directory are vendored verbatim from
[markdown-it/benchmark/samples](https://github.com/markdown-it/markdown-it/tree/master/benchmark/samples)
and remain under their original **MIT** license (see `LICENSE` in this folder).

They are used as the cross-library corpus for `benchmark/scenarios/parse.bench.ts`,
giving us comparable numbers against `markdown-it` / `marked` / `remark` on the
same widely-used micro-fixtures that the markdown-it project itself uses.

Updating: bump the upstream commit by re-running the download script described
in `benchmark/README.md` — do not hand-edit these files.
