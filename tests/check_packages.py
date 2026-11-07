"""Validate final ZIP integrity and relative references after extraction."""
from pathlib import Path, PurePosixPath
from zipfile import ZipFile
import hashlib
import json
import re

root = Path(__file__).resolve().parents[1]
for kind in ('review', 'upload'):
    with ZipFile(root / 'dist' / f'norms-teleology-study1-{kind}.zip') as z:
        assert z.testzip() is None
        names = set(z.namelist())
        assert all(not PurePosixPath(n).is_absolute() and '..' not in PurePosixPath(n).parts for n in names)
        assert not any(n.endswith(('.sqlite3', '.env', '.DS_Store')) for n in names)
        manifest = json.loads(z.read('PACKAGE_MANIFEST.json'))
        assert names == set(manifest['sha256']) | {'PACKAGE_MANIFEST.json'}
        for name, digest in manifest['sha256'].items():
            assert hashlib.sha256(z.read(name)).hexdigest() == digest, name
        for html in (n for n in names if n.endswith('.html')):
            for target in re.findall(r'(?:src|href)="([^"]+)"', z.read(html).decode()):
                if target.startswith(('http:', 'https:', '#')):
                    continue
                assert str(PurePosixPath(html).parent / target) in names, (html, target)
        if kind == 'review':
            assert b'NORMS_REVIEW = true' in z.read('index.html')
            assert b'type="module"' not in z.read('index.html')
            assert 'explanation-lab-client.js' not in names
            assert 'js/collection.js' not in names
        else:
            assert b'NORMS_COLLECTION = true' in z.read('index.html')
            assert b'NORMS_REVIEW = true' in z.read('review.html')
            config = json.loads(z.read('explanation-lab.config.json'))
            assert config['conditions'] == ['control', 'survival', 'ecology']
            assert config['demographicFields'] == ['age', 'gender', 'other_gender', 'race', 'other_race', 'ethnicity']
            assert config['experimentVersion'] == manifest['version'] == 'norms-teleology-study1-2.1.0'
            assert len(config['packageFingerprint']) == 64
        print(f'{kind}: {len(names)} files, ZIP CRCs, SHA-256 manifest, entry point, and asset paths passed')
