"""Stage only participant runtime files from an upload/converted ZIP for hosting."""
from pathlib import Path
from zipfile import ZipFile
import argparse
import hashlib
import json

parser = argparse.ArgumentParser()
parser.add_argument('zip_path', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
allowed = {
    'index.html', 'explanation-lab-client.js', 'explanation-lab.config.json',
    'assets/nalk-prominent-hair.png', 'assets/nalk-hairless.png',
    'assets/marvin-prominent-spikes.png', 'assets/marvin-normal-feet.png',
    'assets/virdex-spotted.png', 'assets/virdex-unspotted.png', 'css/study.css',
    'js/collection.js', 'js/config.js', 'js/core.js', 'js/materials.js', 'js/study.js',
    'vendor/THIRD_PARTY_NOTICES.md', 'vendor/jspsych-7.3.4.css',
    'vendor/jspsych-7.3.4.js', 'vendor/plugin-html-button-response-1.1.3.js'
}
args.output.mkdir(parents=True, exist_ok=True)
with ZipFile(args.zip_path) as archive:
    missing = allowed - set(archive.namelist())
    if missing:
        raise ValueError(f'Missing runtime files: {sorted(missing)}')
    for name in sorted(allowed):
        target = args.output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(archive.read(name))
(args.output / '.nojekyll').write_text('')
manifest = {name: hashlib.sha256((args.output / name).read_bytes()).hexdigest() for name in sorted(allowed)}
print(json.dumps({'output': str(args.output.resolve()), 'files': manifest}, indent=2))
