"""Build and verify the self-contained offline mixed-condition pilot reviewer ZIP."""
from pathlib import Path, PurePosixPath
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib, json, re
root=Path(__file__).resolve().parents[1]
source=root/'code/experiments/mixed-pilot'
version=re.search(r"version: '([^']+)'",(source/'js/materials.js').read_text()).group(1)
files={p.relative_to(source).as_posix():p.read_bytes() for p in sorted(source.rglob('*')) if p.is_file() and not p.name.startswith('.')}
collection_files = dict(files)
for n in ['collection.html','js/collection.js','explanation-lab-client.js']: files.pop(n,None)
assert not any('collection' in n or 'explanation-lab-client' in n for n in files)
assert len([n for n in files if n.endswith('.png')])==6
for name,data in files.items():
 if name.endswith('.html'):
  html=data.decode();assert 'type="module"' not in html
  for target in re.findall(r'(?:src|href)="([^"]+)"',html):
   assert not target.startswith(('http:','https:'))
   assert (PurePosixPath(name).parent/target).as_posix() in files,(name,target)
files['PACKAGE_MANIFEST.json']=(json.dumps({'package':'offline-review','version':version,'sha256':{n:hashlib.sha256(b).hexdigest() for n,b in files.items()}},indent=2)+'\n').encode()
release_version=version.rsplit('-',1)[-1]
output=root/f'dist/norms-teleology-mixed-pilot-review-{release_version}.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output,'w',compression=ZIP_DEFLATED,compresslevel=9) as z:
 for name,content in sorted(files.items()):
  info=ZipInfo(name,(2026,11,1,12,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,content)
with ZipFile(output) as z:
 assert z.testzip() is None
 manifest=json.loads(z.read('PACKAGE_MANIFEST.json'))
 assert set(z.namelist())==set(manifest['sha256'])|{'PACKAGE_MANIFEST.json'}
 for n,digest in manifest['sha256'].items():assert hashlib.sha256(z.read(n)).hexdigest()==digest
print(f'{output} ({output.stat().st_size:,} bytes); ZIP integrity, all bundled assets and entry points verified.')

# Separate converter input; the official Console produces the immutable release.
collection_files['review.html']=collection_files['index.html']
collection_files['index.html']=collection_files.pop('collection.html')
collection_path=root/f'dist/norms-teleology-mixed-pilot-upload-{release_version}.zip'
with ZipFile(collection_path,'w',compression=ZIP_DEFLATED,compresslevel=9) as z:
 for name,content in sorted(collection_files.items()):
  info=ZipInfo(name,(2026,11,1,12,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,content)
print(f'{collection_path} ({collection_path.stat().st_size:,} bytes); converter input, not a frozen native release.')
